import { NODE_ENV } from "astro:env/client";
import fetchSiteMetadata, { type Metadata } from "fetch-site-metadata";
import { createResolvedCache } from "#/lib/api/cache";

const cache = createResolvedCache<Metadata>();

// Astro's sharp service refuses SVG inputs unless `image.dangerouslyProcessSVG`
// is enabled, so drop SVG og:images here to keep `<Image>` from crashing the build.
const isSvgSrc = (src: string): boolean => {
  const pathname = src.split(/[?#]/, 1)[0] ?? src;
  return pathname.toLowerCase().endsWith(".svg");
};

const stripSvgImage = (metadata: Metadata): Metadata =>
  metadata.image && isSvgSrc(metadata.image.src)
    ? { ...metadata, image: undefined }
    : metadata;

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

    return fetchSiteMetadata(url, {
      suppressAdditionalRequest: true,
      headers: {
        accept: "text/html",
        "accept-language": "ja,en-US;q=0.7,en;q=0.3",
      },
    })
      .then(stripSvgImage)
      .catch(() => ({
        title: "Not Found",
        description: "Page not found",
        image: undefined,
        icon: undefined,
      }));
  });
