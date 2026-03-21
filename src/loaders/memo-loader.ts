import type { Loader } from "astro/loaders";
import { glob } from "astro/loaders";
import { generateRssEntryId, parseRssItems } from "./rss-parser";

const RSS_FEED_URL = "https://kkhys.me/rss.xml";
const RSS_FETCH_TIMEOUT_MS = 10_000;
const BOT_AUTHOR = "blog-feed";

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
        const response = await fetch(RSS_FEED_URL, {
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
    },
  };
}
