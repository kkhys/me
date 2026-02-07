import type { APIRoute } from "astro";
import { Hono } from "hono";

import { github } from "#/pages/api/_services/github";

const app = new Hono()
  .basePath("/api")
  .onError((error, c) => {
    console.error("error occured >>", error);
    return c.json({ error: "Something went wrong" }, 500);
  })
  .route("/github", github);

export const ALL: APIRoute = (context) => app.fetch(context.request);

export const prerender = false;

export type APIType = typeof app;
