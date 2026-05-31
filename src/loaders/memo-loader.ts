import { readFileSync } from "node:fs";
import type { Loader, LoaderContext } from "astro/loaders";
import { glob } from "astro/loaders";
import { BLOG_RSS_FEED_URL, ZENN_RSS_FEED_URL } from "../config/constants";
import { generateRssEntryId, parseRssItems } from "./rss-parser";

const RSS_FETCH_TIMEOUT_MS = 10_000;
const BLOG_BOT_AUTHOR = "blog-feed";
const ZENN_BOT_AUTHOR = "zenn-feed";
const OSS_BOT_AUTHOR = "oss-project";
const OSS_PROJECTS_PATH = "memo-content/data/oss-projects.json";

interface OssProject {
  slug: string;
  name: string;
  url: string;
  createdAt: string; // ISO 8601
}

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

async function loadRssFeed(
  context: LoaderContext,
  { feedUrl, author, idPrefix }: RssFeedSource,
): Promise<void> {
  const { store, parseData, generateDigest, renderMarkdown, logger } = context;

  try {
    const response = await fetch(feedUrl, {
      signal: AbortSignal.timeout(RSS_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      logger.warn(
        `RSS fetch failed for ${feedUrl} (status ${response.status})`,
      );
      return;
    }

    const xml = await response.text();
    const items = parseRssItems(xml);

    // Remove stale entries no longer in the feed
    const prefix = `${idPrefix}-`;
    const freshIds = new Set(
      items.map((i) => generateRssEntryId(i.guid, idPrefix)),
    );
    for (const [id] of store.entries()) {
      if (id.startsWith(prefix) && !freshIds.has(id)) {
        store.delete(id);
      }
    }

    let loaded = 0;
    for (const item of items) {
      try {
        const id = generateRssEntryId(item.guid, idPrefix);
        const body = `${item.title}\n\n${item.link}`;

        const data = await parseData({
          id,
          data: {
            id,
            createdAt: new Date(item.pubDate),
            isDraft: false,
            author,
            hideLinkCard: false,
            isBot: true,
          },
        });

        const digest = generateDigest(data);

        // Skip rendering if the entry hasn't changed
        if (store.get(id)?.digest === digest) {
          loaded++;
          continue;
        }

        const rendered = await renderMarkdown(body);
        store.set({ id, data, body, rendered, digest });
        loaded++;
      } catch (error) {
        logger.warn(
          `Skipping RSS entry ${item.guid}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    logger.info(`Loaded ${loaded} RSS entries from ${feedUrl}`);
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

      const { store, parseData, generateDigest, renderMarkdown, logger } =
        context;

      // Load RSS-based bot feeds (blog, Zenn)
      for (const source of RSS_FEED_SOURCES) {
        await loadRssFeed(context, source);
      }

      // Load OSS project entries
      try {
        const ossProjects: OssProject[] = JSON.parse(
          readFileSync(OSS_PROJECTS_PATH, "utf-8"),
        );

        const freshIds = new Set(
          ossProjects.map((p) => generateOssEntryId(p.slug)),
        );
        for (const [id] of store.entries()) {
          if (id.startsWith("oss-") && !freshIds.has(id)) {
            store.delete(id);
          }
        }

        let ossLoaded = 0;
        for (const project of ossProjects) {
          try {
            const id = generateOssEntryId(project.slug);
            const body = `${project.name}\n\n${project.url}`;

            const data = await parseData({
              id,
              data: {
                id,
                createdAt: new Date(project.createdAt),
                isDraft: false,
                author: OSS_BOT_AUTHOR,
                hideLinkCard: false,
                isBot: true,
              },
            });

            const digest = generateDigest(data);
            if (store.get(id)?.digest === digest) {
              ossLoaded++;
              continue;
            }

            const rendered = await renderMarkdown(body);
            store.set({ id, data, body, rendered, digest });
            ossLoaded++;
          } catch (error) {
            logger.warn(
              `Skipping OSS entry ${project.slug}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }

        logger.info(`Loaded ${ossLoaded} OSS project entries`);
      } catch (error) {
        logger.warn(
          `Failed to load OSS projects: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  };
}
