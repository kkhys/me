import { allPosts } from "contentlayer/generated";
import type { Post } from "contentlayer/generated";
import { compareAsc, compareDesc } from "date-fns";
import { env } from "#/env";
import { postMetadata } from "#/share/post-metadata";
import { searchItems } from "#/share/search-items";

export const getPublicPosts = () =>
  allPosts
    .filter(
      ({ status }) => env.NODE_ENV === "development" || status === "published",
    )
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    );

export const getPublicPostMetadata = (sort: "asc" | "desc" = "desc") =>
  postMetadata
    .filter(
      ({ status }) => env.NODE_ENV === "development" || status === "published",
    )
    .sort((a, b) =>
      sort === "asc"
        ? compareAsc(new Date(a.publishedAt), new Date(b.publishedAt))
        : compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    );

export const getPublicSearchItems = () =>
  searchItems.filter(
    ({ status }) => env.NODE_ENV === "development" || status === "published",
  );

export const getPostBySlug = (slug: string) =>
  allPosts.find(
    (post) =>
      (env.NODE_ENV === "development" || post.status === "published") &&
      post.slug === slug,
  );

export const getPostMetadataBySlug = (slug: string) =>
  postMetadata.find(
    (post) =>
      (env.NODE_ENV === "development" || post.status === "published") &&
      post.slug === slug,
  );

export const getRelatedPosts = ({
  _id: id,
  category,
}: Pick<Post, "_id" | "category">) =>
  fisherYatesShuffle(
    getPublicPosts().filter(
      (post) =>
        post.status === "published" &&
        post._id !== id &&
        post.category === category,
    ),
  ).slice(0, 5);

export const fisherYatesShuffle = <T,>(items: T[]): T[] => {
  const copy = [...items];
  let i = copy.length;

  while (i > 1) {
    const j = Math.floor(Math.random() * i--);
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }

  return copy;
};
