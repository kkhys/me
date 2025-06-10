import { defineAction } from "astro:actions";
// import { NODE_ENV } from "astro:env/client";
import { z } from "astro:schema";
import { redis } from "#/lib/redis";

export const pageView = {
  getPageViews: defineAction({
    input: z.object({ slug: z.string() }),
    handler: async (input) => {
      const { slug } = input;
      // const env = NODE_ENV;
      // console.log("env", env);
      return (
        (await redis.get<number>(
          ["pageviews", "production", slug].join(":"),
        )) ?? 0
      );
    },
  }),
  incrementViews: defineAction({
    input: z.object({ slug: z.string() }),
    handler: async (input) => {
      const { slug } = input;
      // const env = NODE_ENV;
      // console.log("env", env);
      await redis.incr(["pageviews", "production", slug].join(":"));
    },
  }),
};
