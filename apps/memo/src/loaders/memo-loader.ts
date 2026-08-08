import { readFileSync } from "node:fs";
import type { Loader, LoaderContext } from "astro/loaders";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { BLOG_RSS_FEED_URL, ZENN_RSS_FEED_URL } from "../config/constants";
import { readFeedCache, writeFeedCache } from "./feed-cache";
import { generateRssEntryId, parseRssItems } from "./rss-parser";

const RSS_FETCH_TIMEOUT_MS = 10_000;

// Skip the network entirely when a cached feed is younger than this.
// Beyond the TTL we still revalidate cheaply via conditional requests (304).
const parseTtlMinutes = (): number => {
  const raw = Number(process.env.FEED_CACHE_TTL_MINUTES);
  return Number.isFinite(raw) && raw >= 0 ? raw : 10;
};
const FEED_CACHE_TTL_MS = parseTtlMinutes() * 60_000;

const BLOG_BOT_AUTHOR = "blog-feed";
const ZENN_BOT_AUTHOR = "zenn-feed";
const OSS_BOT_AUTHOR = "oss-project";
const OSS_PROJECTS_PATH = "memo-content/data/oss-projects.json";

const ossProjectsSchema = z.array(
  z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
    url: z.url(),
    // ISO 8601
    createdAt: z.string().min(1),
  }),
);

interface RssFeedSource {
  feedUrl: string;
  author: string;
  idPrefix: string;
}

export const generateOssEntryId = (slug: string): string => `oss-${slug}`;

const RSS_FEED_SOURCES: RssFeedSource[] = [
  { feedUrl: BLOG_RSS_FEED_URL, author: BLOG_BOT_AUTHOR, idPrefix: "rss" },
  { feedUrl: ZENN_RSS_FEED_URL, author: ZENN_BOT_AUTHOR, idPrefix: "zenn" },
];

type FeedLogger = LoaderContext["logger"];

// Fetch the feed XML, using a TTL cache + conditional requests to avoid
// re-downloading unchanged feeds on every build. Returns undefined only when
// the feed is unreachable and no cached copy exists.
async function fetchFeedXml(
  feedUrl: string,
  cacheKey: string,
  logger: FeedLogger,
): Promise<string | undefined> {
  const cached = readFeedCache(cacheKey);
  const now = Date.now();

  // Within TTL: serve straight from cache, no network request.
  if (cached && now - cached.fetchedAt < FEED_CACHE_TTL_MS) {
    const ageSec = Math.round((now - cached.fetchedAt) / 1000);
    logger.info(`Using cached feed ${feedUrl} (age ${ageSec}s)`);
    return cached.xml;
  }

  const headers: Record<string, string> = {};
  if (cached?.etag) headers["If-None-Match"] = cached.etag;
  if (cached?.lastModified) headers["If-Modified-Since"] = cached.lastModified;

  let response: Response;
  try {
    response = await fetch(feedUrl, {
      headers,
      signal: AbortSignal.timeout(RSS_FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    // Network error / timeout: prefer a stale cache over losing the feed.
    const reason = error instanceof Error ? error.message : String(error);
    if (cached) {
      logger.warn(`RSS fetch errored for ${feedUrl} (${reason}), falling back to stale cache`);
      return cached.xml;
    }
    throw error;
  }

  // Not modified: refresh the TTL window and reuse the cached body.
  if (response.status === 304 && cached) {
    writeFeedCache(cacheKey, { ...cached, fetchedAt: now });
    logger.info(`Feed not modified ${feedUrl} (304), using cache`);
    return cached.xml;
  }

  if (!response.ok) {
    if (cached) {
      logger.warn(
        `RSS fetch failed for ${feedUrl} (status ${response.status}), falling back to stale cache`,
      );
      return cached.xml;
    }
    logger.warn(`RSS fetch failed for ${feedUrl} (status ${response.status})`);
    return undefined;
  }

  const xml = await response.text();
  const etag = response.headers.get("etag");
  const lastModified = response.headers.get("last-modified");
  writeFeedCache(cacheKey, {
    fetchedAt: now,
    xml,
    ...(etag ? { etag } : {}),
    ...(lastModified ? { lastModified } : {}),
  });
  logger.info(`Fetched fresh feed ${feedUrl}`);
  return xml;
}

interface BotEntry {
  id: string;
  body: string;
  createdAt: Date;
}

// Shared upsert sequence for bot-generated entries (RSS feeds, OSS projects):
// prune stale ids under the prefix, then parse, digest, and render each entry,
// skipping unchanged ones so cached renders survive rebuilds.
async function upsertBotEntries(
  context: LoaderContext,
  {
    idPrefix,
    author,
    label,
    entries,
  }: {
    idPrefix: string;
    author: string;
    label: string;
    entries: BotEntry[];
  },
): Promise<void> {
  const { store, parseData, generateDigest, renderMarkdown, logger } = context;

  const prefix = `${idPrefix}-`;
  const freshIds = new Set(entries.map((entry) => entry.id));
  for (const [id] of store.entries()) {
    if (id.startsWith(prefix) && !freshIds.has(id)) {
      store.delete(id);
    }
  }

  let loaded = 0;
  for (const entry of entries) {
    try {
      const data = await parseData({
        id: entry.id,
        data: {
          id: entry.id,
          createdAt: entry.createdAt,
          isDraft: false,
          author,
          hideLinkCard: false,
          isBot: true,
        },
      });

      const digest = generateDigest(data);

      // Skip rendering if the entry hasn't changed
      if (store.get(entry.id)?.digest === digest) {
        loaded++;
        continue;
      }

      const rendered = await renderMarkdown(entry.body);
      store.set({ id: entry.id, data, body: entry.body, rendered, digest });
      loaded++;
    } catch (error) {
      logger.warn(
        `Skipping ${label} entry ${entry.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  logger.info(`Loaded ${loaded} ${label} entries`);
}

async function loadRssFeed(
  context: LoaderContext,
  { feedUrl, author, idPrefix }: RssFeedSource,
): Promise<void> {
  const { logger } = context;

  try {
    const xml = await fetchFeedXml(feedUrl, idPrefix, logger);
    if (xml === undefined) return;

    const items = parseRssItems(xml);

    await upsertBotEntries(context, {
      idPrefix,
      author,
      label: `RSS (${feedUrl})`,
      entries: items.map((item) => ({
        id: generateRssEntryId(item.guid, idPrefix),
        body: `${item.title}\n\n${item.link}`,
        createdAt: new Date(item.pubDate),
      })),
    });
  } catch (error) {
    logger.warn(
      `Failed to fetch RSS feed ${feedUrl}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function memoLoader(): Loader {
  const basePath =
    process.env.USE_FIXTURE_DATA === "true"
      ? "./src/__fixtures__/memo-sample"
      : "./memo-content/memo";

  const globLoader = glob({ pattern: "**/index.md", base: basePath });

  return {
    name: "memo-loader",
    load: async (context) => {
      // Delegate to glob loader for markdown memos
      await globLoader.load(context);

      // Skip RSS fetch in fixture mode
      if (process.env.USE_FIXTURE_DATA === "true") return;

      const { logger } = context;

      // Load RSS-based bot feeds (blog, Zenn)
      for (const source of RSS_FEED_SOURCES) {
        await loadRssFeed(context, source);
      }

      // Load OSS project entries
      try {
        const ossProjects = ossProjectsSchema.parse(
          JSON.parse(readFileSync(OSS_PROJECTS_PATH, "utf-8")),
        );

        await upsertBotEntries(context, {
          idPrefix: "oss",
          author: OSS_BOT_AUTHOR,
          label: "OSS project",
          entries: ossProjects.map((project) => ({
            id: generateOssEntryId(project.slug),
            body: `${project.name}\n\n${project.url}`,
            createdAt: new Date(project.createdAt),
          })),
        });
      } catch (error) {
        logger.warn(
          `Failed to load OSS projects: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  };
}
