import { NODE_ENV } from "astro:env/client";
import fetchSiteMetadata, { type Metadata } from "fetch-site-metadata";
import { createResolvedCache } from "#/lib/api/cache";

const cache = createResolvedCache<Metadata>();

// Astro's sharp service refuses SVG inputs unless `image.dangerouslyProcessSVG`
// is enabled, so drop SVG og:images here to keep `<Image>` from crashing the build.
const isSvgSrc = (src: string): boolean => {
  const pathname = src.split(/[?#]/u, 1)[0] ?? src;
  return pathname.toLowerCase().endsWith(".svg");
};

// Some og:image endpoints advertise `content-type: image/png` but actually serve
// HTML (e.g. a bot-protection challenge page) to non-browser clients. sharp then
// fails with "Could not process image metadata" and crashes the whole build, so
// we sniff the leading bytes and only keep images sharp can actually decode.
const matchesAt = (bytes: Uint8Array, offset: number, signature: readonly number[]): boolean =>
  signature.every((byte, index) => bytes[offset + index] === byte);

const isRasterImage = (bytes: Uint8Array): boolean => {
  // PNG
  if (matchesAt(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return true;
  }
  // JPEG
  if (matchesAt(bytes, 0, [0xff, 0xd8, 0xff])) return true;
  // GIF ("GIF8")
  if (matchesAt(bytes, 0, [0x47, 0x49, 0x46, 0x38])) return true;
  // WebP ("RIFF"...."WEBP")
  if (
    matchesAt(bytes, 0, [0x52, 0x49, 0x46, 0x46]) &&
    matchesAt(bytes, 8, [0x57, 0x45, 0x42, 0x50])
  ) {
    return true;
  }
  // AVIF / HEIF (ISOBMFF "ftyp" box)
  if (matchesAt(bytes, 4, [0x66, 0x74, 0x79, 0x70])) return true;
  return false;
};

const isProcessableImage = async (src: string): Promise<boolean> => {
  try {
    const response = await fetch(src, { headers: { accept: "image/*" } });
    if (!response.ok || !response.body) return false;

    const reader = response.body.getReader();
    const bytes: number[] = [];
    while (bytes.length < 16) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) bytes.push(...value);
    }
    await reader.cancel();

    return isRasterImage(new Uint8Array(bytes));
  } catch {
    return false;
  }
};

const dropUnprocessableImage = async (metadata: Metadata): Promise<Metadata> => {
  const src = metadata.image?.src;
  if (!src || isSvgSrc(src)) {
    return src ? { ...metadata, image: undefined } : metadata;
  }
  return (await isProcessableImage(src)) ? metadata : { ...metadata, image: undefined };
};

export const getMetadata = (url: string) =>
  cache(url, async () => {
    if (NODE_ENV !== "production" || process.env.CI) {
      return {
        title: "リンク",
        description: "外部リンク",
        image: undefined,
        icon: undefined,
      };
    }

    return await fetchSiteMetadata(url, {
      suppressAdditionalRequest: true,
      headers: {
        accept: "text/html",
        "accept-language": "ja,en-US;q=0.7,en;q=0.3",
      },
    })
      .then(dropUnprocessableImage)
      .catch(() => ({
        title: "Not Found",
        description: "Page not found",
        image: undefined,
        icon: undefined,
      }));
  });
