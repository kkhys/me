import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { SITE_URL } from "#/config/constants";
import { getImagesForMemo } from "#/utils/image";
import { memoImageAlt } from "#/utils/image-alt";
import { getPublishedMemos } from "#/utils/memo";
import { getAuthorInfo } from "#/utils/user";

export const getStaticPaths = (async () => {
  const memos = await getPublishedMemos();
  return Promise.all(
    memos.map(async (memo) => {
      const { name: authorName, avatar } = await getAuthorInfo(memo.data.author);
      const images = getImagesForMemo(memo.id);
      return {
        params: { id: memo.data.id },
        props: { memo, authorName, avatar, images },
      };
    }),
  );
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) => {
  const { memo, authorName, avatar, images } = props;
  return new Response(
    JSON.stringify({
      id: memo.data.id,
      body: memo.body,
      createdAt: memo.data.createdAt.toISOString(),
      author: {
        name: authorName,
        username: memo.data.author,
        avatar: new URL(avatar.src, SITE_URL).href,
      },
      tag: memo.data.tag ?? null,
      images: images.map(({ file, src }, index) => ({
        src: new URL(src.src, SITE_URL).href,
        width: src.width,
        height: src.height,
        alt: memoImageAlt(file, index, memo.data.images),
      })),
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
