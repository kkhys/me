import fetchSiteMetadata, { type Metadata } from "fetch-site-metadata";

const metadataCache = new Map<string, Metadata>();

export const getMetadata = async (url: string) => {
  const cachedMetadata = metadataCache.get(url);
  if (cachedMetadata) return cachedMetadata;

  return fetchSiteMetadata(url, {
    suppressAdditionalRequest: true,
    headers: {
      accept: "text/html",
      "accept-language": "ja,en-US;q=0.7,en;q=0.3",
    },
  })
    .then((metadata) => {
      metadataCache.set(url, metadata);
      return metadata;
    })
    .catch(() => ({
      title: "Not Found",
      description: "Page not found",
      image: null,
      icon: null,
    }));
};
