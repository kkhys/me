import { NODE_ENV } from "astro:env/client";
import { createResolvedCache } from "#/lib/api/cache";

export interface MemoImage {
  src: string;
  width: number;
  height: number;
}

export interface MemoAuthor {
  name: string;
  username: string;
  avatar: string;
}

export interface MemoPost {
  id: string;
  body: string;
  createdAt: string;
  author: MemoAuthor;
  tag: string | null;
  images: MemoImage[];
}

const MEMO_API = "https://memo.kkhys.me/api/posts";

const cache = createResolvedCache<MemoPost | null>();

export const getMemoPost = (id: string) =>
  cache(id, async () => {
    if (NODE_ENV !== "production" || process.env.CI) {
      return {
        id,
        body: "サンプルメモ投稿",
        createdAt: new Date().toISOString(),
        author: {
          name: "Keisuke Hayashi",
          username: "kkhys",
          avatar: "https://memo.kkhys.me/placeholder-avatar.jpg",
        },
        tag: null,
        images: [],
      };
    }

    try {
      const res = await fetch(`${MEMO_API}/${id}.json`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) return null;
      return res.json() as Promise<MemoPost>;
    } catch {
      return null;
    }
  });

/** Extract ID from memo.kkhys.me/post/[id] URL */
export const extractMemoId = (url: string): string | null => {
  const match = url.match(/^https?:\/\/memo\.kkhys\.me\/posts?\/([A-Z0-9]+)$/i);
  return match?.[1] ?? null;
};
