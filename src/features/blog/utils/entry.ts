import { type InferEntrySchema, getCollection } from "astro:content";
import { NODE_ENV } from "astro:env/client";
import { relatedEntriesCount } from "#/config/constant";

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
