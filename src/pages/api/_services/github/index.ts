import { z } from "astro:schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getLastUpdatedTimeByFile } from "#/pages/api/_services/github/last-update-file";
import { getLastUpdatedTime } from "#/pages/api/_services/github/repository";

export const github = new Hono()
  .get(
    "/last-updated-file",
    zValidator("query", z.object({ path: z.string() })),
    async (c) => {
      const { path } = c.req.valid("query");

      return c.json(await getLastUpdatedTimeByFile(path));
    },
  )
  .get(
    "/repo-info/:owner/:repository",
    zValidator(
      "param",
      z.object({
        owner: z.string(),
        repository: z.string(),
      }),
    ),
    async (c) => {
      const { owner, repository } = c.req.valid("param");

      return c.json(await getLastUpdatedTime(owner, repository), 200, {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
      });
    },
  );
