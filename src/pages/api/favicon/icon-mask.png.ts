import type { APIRoute } from "astro";
import { IconMaskPng } from "#/components/seo/favicon/icon-mask-png";

export const GET: APIRoute = async () => {
  if (import.meta.env.PROD) {
    return new Response("Not Found", { status: 404 });
  }

  const image = await IconMaskPng();
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
