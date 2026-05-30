import { readFileSync } from "node:fs";
import type { Loader } from "astro/loaders";
import { glob } from "astro/loaders";
import { BLOG_RSS_FEED_URL } from "../config/constants";
import { generateRssEntryId, parseRssItems } from "./rss-parser";

const RSS_FETCH_TIMEOUT_MS = 10_000;
const BOT_AUTHOR = "blog-feed";
const OSS_BOT_AUTHOR = "oss-project";
const OSS_PROJECTS_PATH = "memo-content/data/oss-projects.json";

interface OssProject {
  slug: string;
  name: string;
  url: string;
  createdAt: string; // ISO 8601
}

export const generateOssEntryId = (slug: string): string => `oss-${slug}`;

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

      try {
        const response = await fetch(BLOG_RSS_FEED_URL, {
          signal: AbortSignal.timeout(RSS_FETCH_TIMEOUT_MS),
        });
        if (!response.ok) {
          logger.warn(`RSS fetch failed with status ${response.status}`);
          return;
        }

        const xml = await response.text();
        const items = parseRssItems(xml);

        // Remove stale RSS entries no longer in the feed
        const freshIds = new Set(items.map((i) => generateRssEntryId(i.guid)));
        for (const [id] of store.entries()) {
          if (id.startsWith("rss-") && !freshIds.has(id)) {
            store.delete(id);
          }
        }

        let loaded = 0;
        for (const item of items) {
          try {
            const id = generateRssEntryId(item.guid);
            const body = `${item.title}\n\n${item.link}`;

            const data = await parseData({
              id,
              data: {
                id,
                createdAt: new Date(item.pubDate),
                isDraft: false,
                author: BOT_AUTHOR,
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

        logger.info(`Loaded ${loaded} RSS entries`);
      } catch (error) {
        logger.warn(
          `Failed to fetch RSS feed: ${error instanceof Error ? error.message : String(error)}`,
        );
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
