import type { APIRoute } from "astro";
import { createFaviconGenerators } from "./favicon";

const IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";

interface FaviconAsset {
  contentType: string;
  generate: () => Promise<string | Buffer>;
}

/**
 * Builds a dev-only favicon endpoint for a `[file].ts` route. Favicon assets
 * ship as static files in production, so getStaticPaths emits no paths in
 * PROD builds — prerendering a guard response instead would write literal
 * "Not Found" bodies into dist and serve them with status 200.
 *
 * `prod` is overridable for tests.
 */
export const createFaviconRoutes = (
  gradient: string,
  // Vite inlines a real boolean, but Bun's ImportMeta types env values as
  // strings; compare the text so a literal "false" cannot read as truthy.
  { prod = String(import.meta.env.PROD) === "true" }: { prod?: boolean | undefined } = {},
) => {
  const generators = createFaviconGenerators(gradient);
  const files: Record<string, FaviconAsset> = {
    "icon.svg": { contentType: "image/svg+xml", generate: generators.IconSvg },
    "icon-192.png": { contentType: "image/png", generate: generators.Icon192Png },
    "icon-512.png": { contentType: "image/png", generate: generators.Icon512Png },
    "icon-mask.png": { contentType: "image/png", generate: generators.IconMaskPng },
    "apple-touch-icon.png": { contentType: "image/png", generate: generators.AppleTouchIconPng },
  };

  const getStaticPaths = () =>
    prod ? [] : Object.keys(files).map((file) => ({ params: { file } }));

  const GET: APIRoute = async ({ params }) => {
    const asset = files[params.file ?? ""];
    if (!asset) {
      return new Response("Not Found", { status: 404 });
    }

    const body = await asset.generate();
    return new Response(typeof body === "string" ? body : new Uint8Array(body), {
      headers: {
        "Content-Type": asset.contentType,
        "Cache-Control": IMAGE_CACHE_CONTROL,
      },
    });
  };

  return { getStaticPaths, GET };
};

/**
 * Wraps a PNG generator as a production OG-image route handler. Unlike the
 * favicon routes, OG images are served in production.
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
