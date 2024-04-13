import type { MetadataRoute } from 'next';
import { allLegals, allPosts } from 'contentlayer/generated';

import { site } from '#/config';

const formatPublishedDate = (publishedDate: Date | string | number) =>
  new Date(publishedDate).toISOString().split('T')[0];

const sitemap = (): MetadataRoute.Sitemap => {
  const routes = ['/', '/posts'].map((route) => ({
    url: `${site.url.base}${route}`,
    lastModified: formatPublishedDate(new Date()),
  })) satisfies MetadataRoute.Sitemap;

  const legals = allLegals.map(({ slug, publishedAt }) => ({
    url: `${site.url.base}/legal/${slug}`,
    lastModified: formatPublishedDate(publishedAt),
  })) satisfies MetadataRoute.Sitemap;

  const posts = allPosts
    .filter((post) => post.status === 'published')
    .map(({ url, publishedAt }) => ({
      url,
      lastModified: formatPublishedDate(publishedAt),
    })) satisfies MetadataRoute.Sitemap;

  return [...routes, ...legals, ...posts];
};

export default sitemap;
