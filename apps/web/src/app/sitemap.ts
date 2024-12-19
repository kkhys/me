import { allLegals } from "contentlayer/generated";
import type { MetadataRoute } from "next";

import { siteConfig } from "#/config";
import { getPublicPosts } from "#/utils/post";

const formatPublishedDate = (publishedDate: Date | string | number) =>
  new Date(publishedDate).toISOString().split("T")[0];

const sitemap = (): MetadataRoute.Sitemap => {
  const routes = ["/", "/posts"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: formatPublishedDate(new Date()),
  })) satisfies MetadataRoute.Sitemap;

  const legals = allLegals.map(({ slug, publishedAt }) => ({
    url: `${siteConfig.url}/${slug}`,
    lastModified: formatPublishedDate(publishedAt),
  })) satisfies MetadataRoute.Sitemap;

  const posts = getPublicPosts().map(({ url, publishedAt }) => ({
    url,
    lastModified: formatPublishedDate(publishedAt),
  })) satisfies MetadataRoute.Sitemap;

  return [...routes, ...legals, ...posts];
};

export default sitemap;
