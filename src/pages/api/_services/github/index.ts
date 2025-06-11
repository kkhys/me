import { z } from "astro:schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getGithubContributions } from "#/pages/api/_services/github/contributions";
import { getLastUpdatedTimeByFile } from "#/pages/api/_services/github/last-update-file";

export const github = new Hono()
  .get("/contributions", async (c) =>
    c.json(await getGithubContributions(), 200, {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    }),
  )
  .get(
    "/last-updated-file",
    zValidator("query", z.object({ path: z.string() })),
    async (c) => {
      const { path } = c.req.valid("query");
      return c.json(await getLastUpdatedTimeByFile(path));
    },
  );
