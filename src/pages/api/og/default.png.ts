import type { APIRoute } from "astro";
import { OpengraphImage } from "#/components/seo/opengraph-image";

export const GET: APIRoute = async () => {
  const image = await OpengraphImage();
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
