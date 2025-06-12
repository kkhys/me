import { defineAction } from "astro:actions";
import { NODE_ENV } from "astro:env/client";
import { z } from "astro:schema";
import { redis } from "#/lib/redis";

export const pageView = {
  getPageViews: defineAction({
    input: z.object({ slug: z.string() }),
    handler: async (input) => {
      const { slug } = input;
      return (
        (await redis.get<number>(["pageviews", NODE_ENV, slug].join(":"))) ?? 0
      );
    },
  }),
  incrementViews: defineAction({
    input: z.object({ slug: z.string() }),
    handler: async (input) => {
      const { slug } = input;
      await redis.incr(["pageviews", NODE_ENV, slug].join(":"));
    },
  }),
};
