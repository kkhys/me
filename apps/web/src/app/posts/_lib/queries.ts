import "server-only";

import { redis } from "@kkhys/db";
import { unstable_cache } from "next/cache";
import { env } from "#/env";
import { postMetadataForEdge } from "#/share/post-metadata-for-edge";

export const getPageViews = async ({
  slug,
}: {
  slug: string;
}) =>
  (await redis.get<number>(["pageviews", env.NODE_ENV, slug].join(":"))) ?? 0;

const getAllPageViewsSorted = async () => {
  const prefix = `pageviews:${env.NODE_ENV}:`;
  const keys = postMetadataForEdge.map(({ slug }) => `${prefix}${slug}`);

  if (keys.length === 0) {
    return [];
  }

  const values = await redis.mget<number[]>(...keys);

  const pageViews = keys.map((key, index) => ({
    slug: key.replace(prefix, ""),
    views: values[index] ?? 0,
  }));

  pageViews.sort((a, b) => b.views - a.views);

  return pageViews;
};

export const getCachedAllPageViewsSorted = unstable_cache(
  async () => getAllPageViewsSorted(),
  undefined,
  {
    revalidate: 60 * 60,
  },
);
