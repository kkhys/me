import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Stored under node_modules/.cache so it stays gitignored and can be
// persisted by CI build caches (e.g. Cloudflare Pages) between builds.
const CACHE_DIR = "node_modules/.cache/memo-feeds";

export interface FeedCache {
  // epoch ms of the last successful fetch/revalidation
  fetchedAt: number;
  etag?: string;
  lastModified?: string;
  xml: string;
}

const cachePath = (key: string): string => join(CACHE_DIR, `${key}.json`);

export const readFeedCache = (key: string): FeedCache | null => {
  let raw: string;
  try {
    raw = readFileSync(cachePath(key), "utf-8");
  } catch {
    // Cache miss (file does not exist yet) is expected, not an error.
    return null;
  }

  // A corrupt cache file is treated as a miss so the feed is simply re-fetched
  // and the file overwritten, rather than breaking the build.
  let parsed: FeedCache;
  try {
    parsed = JSON.parse(raw) as FeedCache;
  } catch {
    return null;
  }

  if (typeof parsed.xml === "string" && typeof parsed.fetchedAt === "number") {
    return parsed;
  }
  return null;
};

export const writeFeedCache = (key: string, cache: FeedCache): void => {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachePath(key), JSON.stringify(cache), "utf-8");
};
