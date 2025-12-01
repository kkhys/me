import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { NODE_ENV } from "astro:env/client";

type Memo = CollectionEntry<"memo">;

const sortByDate = (memos: Memo[], order: "desc" | "asc" = "desc"): Memo[] => {
  return [...memos].sort((a, b) => {
    const dateA = new Date(a.data.createdAt).getTime();
    const dateB = new Date(b.data.createdAt).getTime();
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};

export const getPublishedMemos = async () => {
  const memos = await getCollection("memo");
  const isDev = NODE_ENV === "development";

  const filtered = memos.filter(
    ({ data, body }) => (isDev || !data.isDraft) && body,
  );

  return sortByDate(filtered, "desc");
};

export const getMainMemos = async () => {
  const memos = await getPublishedMemos();
  return memos.filter(({ data }) => !data.comment);
};

const buildCommentMap = (memos: Memo[]): Map<string, Memo[]> => {
  const commentMap = new Map<string, Memo[]>();

  for (const memo of memos) {
    if (memo.data.comment) {
      const existing = commentMap.get(memo.data.comment) ?? [];
      commentMap.set(memo.data.comment, [...existing, memo]);
    }
  }

  for (const [id, comments] of commentMap.entries()) {
    commentMap.set(id, sortByDate(comments, "asc"));
  }

  return commentMap;
};

export const getCommentsByMemoId = async (memoId: string) => {
  const memos = await getPublishedMemos();
  const commentMap = buildCommentMap(memos);
  return commentMap.get(memoId) ?? [];
};

const attachComments = (mainMemos: Memo[], allMemos: Memo[]) => {
  const commentMap = buildCommentMap(allMemos);

  return mainMemos.map((mainMemo) => ({
    main: mainMemo,
    comments: commentMap.get(mainMemo.data.id) ?? [],
  }));
};

export const getMemosWithComments = async () => {
  const allMemos = await getPublishedMemos();
  const mainMemos = allMemos.filter(({ data }) => !data.comment);
  return attachComments(mainMemos, allMemos);
};

export const getMemosByTag = async (tag: string) => {
  const allMemos = await getPublishedMemos();
  const mainMemos = allMemos.filter(({ data }) => !data.comment);
  const taggedMainMemos = mainMemos.filter(({ data }) => data.tag === tag);
  return attachComments(taggedMainMemos, allMemos);
};

export const getAllTags = async () => {
  const mainMemos = await getMainMemos();
  const tags = mainMemos
    .map(({ data }) => data.tag)
    .filter((tag) => tag !== undefined);
  return Array.from(new Set(tags)).sort();
};
