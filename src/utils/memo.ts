import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { NODE_ENV } from "astro:env/client";

type Memo = CollectionEntry<"memo">;

export type MemoWithComments = {
  memo: Memo;
  comments: MemoWithComments[];
};

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

const buildNestedComments = (
  memoId: string,
  commentMap: Map<string, Memo[]>,
): MemoWithComments[] => {
  const directComments = commentMap.get(memoId) ?? [];

  return directComments.map((comment) => ({
    memo: comment,
    comments: buildNestedComments(comment.data.id, commentMap),
  }));
};

const attachComments = (mainMemos: Memo[], commentMap: Map<string, Memo[]>) => {
  return mainMemos.map((mainMemo) => ({
    main: mainMemo,
    comments: buildNestedComments(mainMemo.data.id, commentMap),
  }));
};

export const getCommentsByMemoId = async (memoId: string) => {
  const allMemos = await getPublishedMemos();
  const commentMap = buildCommentMap(allMemos);
  return buildNestedComments(memoId, commentMap);
};

export const getMemosWithComments = async () => {
  const allMemos = await getPublishedMemos();
  const mainMemos = allMemos.filter(({ data }) => !data.comment);
  const commentMap = buildCommentMap(allMemos);
  return attachComments(mainMemos, commentMap);
};

export const getMemosWithCommentsAndPinned = async () => {
  const allMemos = await getPublishedMemos();
  const mainMemos = allMemos.filter(({ data }) => !data.comment);
  const commentMap = buildCommentMap(allMemos);

  const pinnedMemos = mainMemos.filter(({ data }) => data.isPinned);
  const unpinnedMemos = mainMemos.filter(({ data }) => !data.isPinned);

  return {
    pinned: attachComments(pinnedMemos, commentMap),
    memos: attachComments(unpinnedMemos, commentMap),
  };
};

export const getMemosByTag = async (tag: string) => {
  const allMemos = await getPublishedMemos();
  const mainMemos = allMemos.filter(({ data }) => !data.comment);
  const taggedMainMemos = mainMemos.filter(({ data }) => data.tag === tag);
  const commentMap = buildCommentMap(allMemos);
  return attachComments(taggedMainMemos, commentMap);
};

export const getAllTags = async () => {
  const mainMemos = await getMainMemos();
  const tags = mainMemos
    .map(({ data }) => data.tag)
    .filter((tag) => tag !== undefined);
  return Array.from(new Set(tags)).sort();
};

export const getQuotedMemo = async (
  quoteId: string,
): Promise<Memo | undefined> => {
  const allMemos = await getPublishedMemos();
  return allMemos.find(({ data }) => data.id === quoteId);
};

export const buildQuoteCountMap = (memos: Memo[]): Map<string, number> => {
  const countMap = new Map<string, number>();
  for (const memo of memos) {
    if (memo.data.quote) {
      const current = countMap.get(memo.data.quote) ?? 0;
      countMap.set(memo.data.quote, current + 1);
    }
  }
  return countMap;
};

export const getMemosByAuthor = async (authorSlug: string) => {
  const allMemos = await getPublishedMemos();
  const mainMemos = allMemos.filter(({ data }) => !data.comment);
  const authorMainMemos = mainMemos.filter(
    ({ data }) => data.author === authorSlug,
  );
  const commentMap = buildCommentMap(allMemos);

  const pinnedMemos = authorMainMemos.filter(({ data }) => data.isPinned);
  const unpinnedMemos = authorMainMemos.filter(({ data }) => !data.isPinned);

  return {
    pinned: attachComments(pinnedMemos, commentMap),
    memos: attachComments(unpinnedMemos, commentMap),
  };
};
