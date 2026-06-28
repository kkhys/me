import { type CollectionEntry, getCollection, type InferEntrySchema } from "astro:content";
import { NODE_ENV } from "astro:env/client";
import { relatedEntriesCount } from "#/config/constant";
import type { ExternalSite } from "#/features/blog/config/external-site";

export type InternalEntry = {
  type: "internal";
  id: string;
  title: string;
  emoji: string;
  category: string;
  tags: string[] | undefined;
  status: string;
  publishedAt: Date;
};

export type ExternalEntry = {
  type: "external";
  title: string;
  url: string;
  siteName: ExternalSite;
  category: string;
  tags: string[] | undefined;
  publishedAt: Date;
};

export type ListEntry = InternalEntry | ExternalEntry;

export const getPublicBlogEntries = async (sort: "asc" | "desc" = "desc") => {
  const entries = await getCollection("blog");

  return entries
    .filter(({ data }) => NODE_ENV === "development" || data.status === "published")
    .toSorted((a, b) => {
      const dateA = new Date(a.data.publishedAt).getTime();
      const dateB = new Date(b.data.publishedAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
};

export const toListEntries = (blogEntries: CollectionEntry<"blog">[]): ListEntry[] =>
  blogEntries.map((entry) => ({
    type: "internal",
    id: entry.id,
    title: entry.data.title,
    emoji: entry.data.emoji,
    category: entry.data.category,
    tags: entry.data.tags,
    status: entry.data.status,
    publishedAt: entry.data.publishedAt,
  }));

const toExternalEntry = (data: {
  title: string;
  url: string;
  siteName: string;
  category: string;
  tags?: string[] | undefined;
  publishedAt: Date;
}): ExternalEntry => ({
  type: "external",
  title: data.title,
  url: data.url,
  siteName: data.siteName as ExternalSite,
  category: data.category,
  tags: data.tags,
  publishedAt: data.publishedAt,
});

export const getPublicListEntries = async (sort: "asc" | "desc" = "desc"): Promise<ListEntry[]> => {
  const blogEntries = await getPublicBlogEntries(sort);
  const externalEntries = await getCollection("externalPost");
  const zennEntries = await getCollection("zennPost");

  const internal = toListEntries(blogEntries);
  const external = externalEntries.map((entry) => toExternalEntry(entry.data));
  const zenn = zennEntries.map((entry) => toExternalEntry(entry.data));

  // Manually curated external posts take precedence over auto-fetched Zenn
  // posts sharing the same URL, allowing per-article category/tag overrides.
  const manualUrls = new Set(external.map((entry) => entry.url));
  const dedupedZenn = zenn.filter((entry) => !manualUrls.has(entry.url));

  return [...internal, ...external, ...dedupedZenn].toSorted((a, b) => {
    const dateA = a.publishedAt.getTime();
    const dateB = b.publishedAt.getTime();
    return sort === "asc" ? dateA - dateB : dateB - dateA;
  });
};

export const getRelatedPosts = async ({
  id,
  category,
  tags,
}: { id: string } & Pick<InferEntrySchema<"blog">, "category" | "tags">) => {
  const candidates = (await getPublicBlogEntries()).filter(
    (post) => post.id !== id && post.data.category === category,
  );

  const scored = candidates.map((post) => ({
    post,
    score: tags?.filter((tag) => post.data.tags?.includes(tag)).length ?? 0,
  }));

  // Sort by shared tag count (desc), shuffle within same score
  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);

  return scored.map(({ post }) => post).slice(0, relatedEntriesCount);
};
