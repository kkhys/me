import { createHash } from "node:crypto";
import type { GetStaticPathsItem } from "astro";
import type { CollectionEntry } from "astro:content";
import {
  type PostNavItem,
  type RelatedPostsInput,
  scoreRelatedPosts,
  toListEntries,
} from "#/features/blog/utils/entry";

// Render inputs that every cached page reads outside of its props. The footer
// prints the current year, so a page restored from the cache would keep last
// year's footer if the year were not part of its key.
const siteWideInputs = { footerYear: new Date().getFullYear() };

// Digest the serialized value instead of storing it verbatim: `cacheKey` is
// written to the incremental-build manifest for every path, and a page of list
// entries serializes to several kilobytes.
export const toCacheKey = (value: unknown): string =>
  createHash("sha256")
    .update(JSON.stringify([siteWideInputs, value]))
    .digest("hex")
    .slice(0, 16);

// The post page renders the entry, the prev/next nav items, and a related-post
// list picked from the whole collection, so all three feed the key. Related
// candidates are keyed on the fields the list displays (via `toListEntries`)
// plus their score; a body-only edit elsewhere must not invalidate this page.
// `digest` is set by the glob loader from the file contents; without one we
// cannot prove the page is unchanged, so it is left uncached.
export const getPostCacheKey = (
  entries: CollectionEntry<"blog">[],
  entry: CollectionEntry<"blog">,
  newerPost: PostNavItem | undefined,
  olderPost: PostNavItem | undefined,
): string | undefined => {
  if (entry.digest === undefined) {
    return undefined;
  }

  const relatedInput: RelatedPostsInput = {
    id: entry.id,
    category: entry.data.category,
    tags: entry.data.tags,
  };
  const related = scoreRelatedPosts(entries, relatedInput);
  const relatedEntries = toListEntries(related.map(({ post }) => post));
  const relatedScores = related.map(({ score }) => score);

  return toCacheKey([entry.digest, newerPost, olderPost, relatedEntries, relatedScores]);
};

// `paginate()` has no cacheKey hook, so key each page on its full props. The
// props only carry `ListEntry` scalars and pagination URLs, never entry bodies.
export const withCacheKey = <T extends GetStaticPathsItem>(
  paths: T[],
): (T & { cacheKey: string })[] =>
  paths.map((path) => Object.assign(path, { cacheKey: toCacheKey(path.props) }));
