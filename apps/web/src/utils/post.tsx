import { allPosts } from "contentlayer/generated";
import type { Post } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { env } from "#/env";

export const getPublicPosts = () =>
  allPosts
    .filter(
      (post) => env.NODE_ENV === "development" || post.status === "published",
    )
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    );

export const getPostBySlug = (slug: string) =>
  allPosts.find(
    (post) =>
      (env.NODE_ENV === "development" || post.status === "published") &&
      post.slug === slug,
  );

export const getRelatedPosts = ({
  _id: id,
  category,
}: Pick<Post, "_id" | "category">) =>
  fisherYatesShuffle(
    allPosts.filter(
      (post) =>
        post.status === "published" &&
        post._id !== id &&
        post.category === category,
    ),
  ).slice(0, 5);

const fisherYatesShuffle = (posts: Post[]) => {
  const copy = [...posts];

  copy.forEach((_, index, arr) => {
    const i = arr.length - 1 - index;
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as Post, arr[i] as Post];
  });

  return copy;
};
