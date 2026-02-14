import { NODE_ENV } from "astro:env/client";
import fetchSiteMetadata, { type Metadata } from "fetch-site-metadata";
import { createResolvedCache } from "#/lib/api/cache";

const cache = createResolvedCache<Metadata>();

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
    }).catch(() => ({
      title: "Not Found",
      description: "Page not found",
      image: undefined,
      icon: undefined,
    }));
  });
