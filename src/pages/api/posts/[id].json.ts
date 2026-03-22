import type { APIRoute, GetStaticPaths, ImageMetadata } from "astro";
import { getImagesForMemo } from "#/utils/image";
import { getPublishedMemos } from "#/utils/memo";
import { getAuthorInfo } from "#/utils/user";

export const getStaticPaths = (async () => {
  const memos = await getPublishedMemos();
  return Promise.all(
    memos.map(async (memo) => {
      const { name: authorName, avatar } = await getAuthorInfo(
        memo.data.author,
      );
      const images = getImagesForMemo(memo.id);
      return {
        params: { id: memo.data.id },
        props: { memo, authorName, avatar, images },
      };
    }),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { memo, authorName, avatar, images } = props as {
    memo: { data: { id: string; createdAt: Date; tag?: string }; body: string };
    authorName: string;
    avatar: ImageMetadata;
    images: ImageMetadata[];
  };
  return new Response(
    JSON.stringify({
      id: memo.data.id,
      body: memo.body,
      createdAt: memo.data.createdAt.toISOString(),
      author: {
        name: authorName,
        avatar: new URL(avatar.src, "https://memo.kkhys.me").href,
      },
      tag: memo.data.tag ?? null,
      images: images.map((img) => ({
        src: new URL(img.src, "https://memo.kkhys.me").href,
        width: img.width,
        height: img.height,
      })),
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
