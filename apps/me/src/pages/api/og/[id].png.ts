import { createOgResponse } from "@kkhys/og/handlers";
import type { GetStaticPaths, InferGetStaticPropsType } from "astro";
import { opengraphImage } from "#/components/opengraph-image.tsx";
import { getPublicBlogEntries } from "#/features/blog/utils/entry";

export const getStaticPaths = (async () =>
  (await getPublicBlogEntries()).map((entry) => {
    const path = {
      params: {
        id: entry.id,
      },
      props: {
        entry,
      },
    };

    return entry.digest === undefined ? path : Object.assign(path, { cacheKey: entry.digest });
  })) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET = createOgResponse<Props>(({ props }) => {
  const { title } = props.entry.data;
  if (!title) {
    return Promise.resolve(new Response("Not found", { status: 404 }));
  }
  return opengraphImage({ title });
});
