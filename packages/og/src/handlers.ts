import type { APIRoute } from "astro";

const IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * Wraps a PNG generator as a dev-only route handler. Favicon assets ship as
 * static files in production, so this returns 404 when PROD to avoid serving
 * them dynamically.
 */
export const createPngHandler = (generator: () => Promise<ArrayBuffer | Buffer>): APIRoute => {
  return async () => {
    if (import.meta.env.PROD) {
      return new Response("Not Found", { status: 404 });
    }

    const image = await generator();
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": IMAGE_CACHE_CONTROL,
      },
    });
  };
};

/** Dev-only SVG route handler. See {@link createPngHandler}. */
export const createSvgHandler = (generator: () => Promise<string>): APIRoute => {
  return async () => {
    if (import.meta.env.PROD) {
      return new Response("Not Found", { status: 404 });
    }

    const svg = await generator();
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": IMAGE_CACHE_CONTROL,
      },
    });
  };
};

/**
 * Wraps a PNG generator as a production OG-image route handler. Unlike the
 * favicon handlers, OG images are served in production (no PROD guard).
 */
export const createOgResponse = (generator: () => Promise<ArrayBuffer | Buffer>): APIRoute => {
  return async () => {
    const image = await generator();
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": IMAGE_CACHE_CONTROL,
      },
    });
  };
};
