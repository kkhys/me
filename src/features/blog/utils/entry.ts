import {
  type CollectionEntry,
  getCollection,
  type InferEntrySchema,
} from "astro:content";
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
    .filter(
      ({ data }) => NODE_ENV === "development" || data.status === "published",
    )
    .sort((a, b) => {
      const dateA = new Date(a.data.publishedAt).getTime();
      const dateB = new Date(b.data.publishedAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
};

export const toListEntries = (
  blogEntries: CollectionEntry<"blog">[],
): ListEntry[] =>
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

const toExternalListEntries = (
  externalEntries: CollectionEntry<"externalPost">[],
): ListEntry[] =>
  externalEntries.map((entry) => ({
    type: "external",
    title: entry.data.title,
    url: entry.data.url,
    siteName: entry.data.siteName as ExternalSite,
    category: entry.data.category,
    tags: entry.data.tags,
    publishedAt: entry.data.publishedAt,
  }));

export const getPublicListEntries = async (
  sort: "asc" | "desc" = "desc",
): Promise<ListEntry[]> => {
  const blogEntries = await getPublicBlogEntries(sort);
  const externalEntries = await getCollection("externalPost");

  const internal = toListEntries(blogEntries);
  const external = toExternalListEntries(externalEntries);

  return [...internal, ...external].sort((a, b) => {
    const dateA = a.publishedAt.getTime();
    const dateB = b.publishedAt.getTime();
    return sort === "asc" ? dateA - dateB : dateB - dateA;
  });
};

export const getRelatedPosts = async ({
  id,
  category,
}: { id: string } & Pick<InferEntrySchema<"blog">, "category">) =>
  fisherYatesShuffle(
    (await getPublicBlogEntries()).filter(
      (post) => post.id !== id && post.data.category === category,
    ),
  ).slice(0, relatedEntriesCount);

const fisherYatesShuffle = <T>(items: T[]): T[] => {
  const copy = [...items];
  let i = copy.length;

  while (i > 1) {
    const j = Math.floor(Math.random() * i--);
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }

  return copy;
};
