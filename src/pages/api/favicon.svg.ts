import type { APIRoute } from "astro";
import { Favicon } from "#/components/seo/favicon";

/**
 * Generate favicon SVG endpoint
 *
 * @description This endpoint is for local development only.
 * Returns 404 in production to prevent unnecessary generation.
 * Use pre-generated favicon.svg in public/ directory for production.
 *
 * @see https://coliss.com/articles/build-websites/operation/work/how-to-favicon.html
 */
export const GET: APIRoute = async () => {
  if (import.meta.env.PROD) {
    return new Response("Not Found", { status: 404 });
  }

  const svg = await Favicon();
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
