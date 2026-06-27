import type { APIRoute } from "astro";

export const createPngHandler = (
  generator: () => Promise<ArrayBuffer | Buffer>,
): APIRoute => {
  return async () => {
    if (import.meta.env.PROD) {
      return new Response("Not Found", { status: 404 });
    }

    const image = await generator();
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  };
};

export const createSvgHandler = (
  generator: () => Promise<string>,
): APIRoute => {
  return async () => {
    if (import.meta.env.PROD) {
      return new Response("Not Found", { status: 404 });
    }

    const svg = await generator();
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  };
};
