import "server-only";

import { redis } from "@kkhys/db";
import { env } from "#/env";

export const getPageViews = async ({
  slug,
}: {
  slug: string;
}) =>
  (await redis.get<number>(["pageviews", env.NODE_ENV, slug].join(":"))) ?? 0;
