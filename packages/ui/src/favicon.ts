import { Buffer } from "node:buffer";
import { isIcoImage, isRasterImage, isSvgDocument } from "./image-signature";

/**
 * Favicon resolved at build time for a link card.
 * - "remote": sharp-decodable raster; render through Astro's image pipeline.
 * - "inline": ICO/SVG, which sharp can't decode; embedded as a data URI.
 * - "none": missing, unreachable, or not a usable image; caller falls back.
 */
export type Favicon =
  | { kind: "remote"; src: string }
  | { kind: "inline"; src: string }
  | { kind: "none" };

const NONE: Favicon = { kind: "none" };

// Inline data URIs are duplicated into every page that renders the card, so
// oversized multi-resolution .ico files fall back to the globe icon instead.
const MAX_INLINE_BYTES = 50 * 1024;

// One resolution per icon URL for the whole build: a single page can render
// many cards pointing at the same host.
const cache = new Map<string, Favicon>();

// Astro only optimizes https remote images (`image.remotePatterns`), so an
// http favicon would be emitted verbatim and blocked as mixed content.
const toHttps = (src: string): string =>
  src.startsWith("http://") ? `https://${src.slice("http://".length)}` : src;

const inline = (mime: string, bytes: Uint8Array): Favicon => ({
  kind: "inline",
  src: `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`,
});

// `fetch-site-metadata` guesses `/favicon.ico` without checking it exists
// (suppressAdditionalRequest), and declared icons can 404 or serve HTML, so
// verify the bytes here; anything dubious degrades to the globe fallback.
const resolve = async (url: string): Promise<Favicon> => {
  try {
    const src = toHttps(url);
    const response = await fetch(src, { headers: { accept: "image/*" } });
    if (!response.ok) return NONE;

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length === 0) return NONE;

    if (isRasterImage(bytes)) return { kind: "remote", src };

    if (bytes.length > MAX_INLINE_BYTES) return NONE;
    if (isIcoImage(bytes)) return inline("image/x-icon", bytes);
    if (isSvgDocument(bytes)) return inline("image/svg+xml", bytes);
    return NONE;
  } catch {
    return NONE;
  }
};

export const getFavicon = async (url: string): Promise<Favicon> => {
  const cached = cache.get(url);
  if (cached) return cached;

  const favicon = await resolve(url);
  cache.set(url, favicon);
  return favicon;
};
