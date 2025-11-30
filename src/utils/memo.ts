import { getCollection } from "astro:content";
import { NODE_ENV } from "astro:env/client";

export const getPublishedMemos = async () => {
  const memos = await getCollection("memo");
  const isDev = NODE_ENV === "development";

  return memos
    .filter(({ data, body }) => (isDev || !data.isDraft) && body)
    .sort((a, b) => {
      const dateA = new Date(a.data.createdAt);
      const dateB = new Date(b.data.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
};

export const getMemosByTag = async (tag: string) => {
  const memos = await getPublishedMemos();
  return memos.filter(({ data }) => data.tag === tag);
};

export const getAllTags = async () => {
  const memos = await getPublishedMemos();
  const tags = memos
    .map(({ data }) => data.tag)
    .filter((tag) => tag !== undefined);
  return Array.from(new Set(tags)).sort();
};
