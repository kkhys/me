import type { APIRoute, GetStaticPaths } from "astro";
import { opengraphImage } from "#/components/opengraph-image.tsx";
import { getPublicBlogEntries } from "#/features/blog/utils/entry";

export const getStaticPaths = (async () =>
  (await getPublicBlogEntries()).map((entry) => {
    return {
      params: {
        id: entry.id,
      },
      props: {
        entry,
      },
    };
  })) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const {
    entry: {
      data: { emoji },
    },
  } = props;

  if (!emoji) {
    return new Response("Not found", { status: 404 });
  }

  const image = await opengraphImage({ emoji });
  return new Response(image);
};
