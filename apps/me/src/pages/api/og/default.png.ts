import type { APIRoute } from "astro";
import { siteOpengraphImage } from "#/components/site-opengraph-image";

export const GET: APIRoute = async () => {
  const image = await siteOpengraphImage();
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
