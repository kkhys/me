import type { Loader } from "astro/loaders";

export type ZennFeedItem = {
  id: string;
  title: string;
  url: string;
  publishedAt: Date;
};

const stripCdata = (value: string): string => value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/u, "$1");

const decodeEntities = (value: string): string =>
  value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll(/&#0*39;/gu, "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");

const getTagText = (block: string, tag: string): string | undefined => {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "u"));
  const raw = match?.[1];
  if (raw === undefined) return undefined;
  return decodeEntities(stripCdata(raw.trim()).trim());
};

const toSlug = (url: string): string | undefined => url.split("/").findLast(Boolean);

/**
 * Parses a Zenn RSS feed into a list of posts. Only the fields needed for the
 * external-post listing (title, link, pubDate) are extracted; everything else
 * in the feed is ignored.
 */
export const parseZennFeed = (xml: string): ZennFeedItem[] => {
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gu)].map((match) => match[1] ?? "");

  return blocks.flatMap((block) => {
    const title = getTagText(block, "title");
    const url = getTagText(block, "link");
    const pubDate = getTagText(block, "pubDate");

    if (!title || !url || !pubDate) return [];

    const id = toSlug(url);
    if (!id) return [];

    const publishedAt = new Date(pubDate);
    if (Number.isNaN(publishedAt.getTime())) return [];

    return [{ id, title, url, publishedAt }];
  });
};

const LAST_MODIFIED_META_KEY = "last-modified";

/**
 * Content layer loader that fetches a Zenn RSS feed at build time and exposes
 * each article as an entry.
 *
 * The previous `Last-Modified` value is persisted in the loader `meta` store
 * (which survives across builds alongside the data store), so subsequent loads
 * send a conditional `If-Modified-Since` request. When the feed is unchanged
 * the server returns 304 and the cached entries are reused without re-parsing.
 *
 * Network or parse failures are logged and leave any previously loaded entries
 * untouched rather than failing the build.
 */
export const zennLoader = ({ feedUrl }: { feedUrl: string }): Loader => ({
  name: "zenn-loader",
  load: async ({ store, meta, parseData, generateDigest, logger }) => {
    const lastModified = meta.get(LAST_MODIFIED_META_KEY);

    let xml: string;
    let nextLastModified: string | null;
    try {
      const response = await fetch(feedUrl, {
        headers: lastModified ? { "If-Modified-Since": lastModified } : {},
      });

      if (response.status === 304) {
        logger.info(`Zenn feed not modified since ${lastModified}; reusing cached entries.`);
        return;
      }

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      xml = await response.text();
      nextLastModified = response.headers.get("last-modified");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(
        `Failed to fetch Zenn feed from ${feedUrl}: ${message}. Keeping previously loaded entries.`,
      );
      return;
    }

    const items = parseZennFeed(xml);

    if (items.length === 0) {
      logger.warn(`Zenn feed at ${feedUrl} contained no items. Keeping previously loaded entries.`);
      return;
    }

    store.clear();

    for (const { id, title, url, publishedAt } of items) {
      const data = await parseData({ id, data: { title, url, publishedAt } });
      store.set({ id, data, digest: generateDigest(data) });
    }

    if (nextLastModified) {
      meta.set(LAST_MODIFIED_META_KEY, nextLastModified);
    } else {
      meta.delete(LAST_MODIFIED_META_KEY);
    }

    logger.info(`Loaded ${items.length} Zenn post(s) from ${feedUrl}.`);
  },
});
