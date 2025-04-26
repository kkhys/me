import type { APIRoute } from "astro";
import { Hono } from "hono";

import { github } from "#/pages/api/_services/github";
import { getSpotifyData } from "#/pages/api/_services/spotify.ts";

const app = new Hono()
  .basePath("/api")
  .onError((error, c) => {
    console.error("error occured >>", error);
    return c.json({ error: "Something went wrong" }, 500);
  })
  .route("/github", github)
  .get("/spotify", async (c) =>
    c.json(await getSpotifyData(), 200, {
      "Cache-Control": "s-maxage=8, stale-while-revalidate=2",
    }),
  );

export const ALL: APIRoute = (context) => app.fetch(context.request);

export const prerender = false;

export type APIType = typeof app;
