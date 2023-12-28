import type { MetadataRoute } from 'next';
import { allLegals, allPosts } from 'contentlayer/generated';

import { serverEnv } from '#/env/index.mjs';

const formatPublishedDate = (publishedDate: Date | string | number) =>
  new Date(publishedDate).toISOString().split('T')[0];

const sitemap = (): MetadataRoute.Sitemap => {
  const routes = ['', '/posts'].map((route) => ({
    url: `${serverEnv.BASE_URL}${route}`,
    lastModified: formatPublishedDate(new Date()),
  })) satisfies MetadataRoute.Sitemap;

  const legals = allLegals.map((legal) => ({
    url: `${serverEnv.BASE_URL}/legal/${legal.slug}`,
    lastModified: formatPublishedDate(legal.publishedAt),
  })) satisfies MetadataRoute.Sitemap;

  const posts = allPosts
    .filter((post) => post.status === 'published')
    .map((post) => ({
      url: `${serverEnv.BASE_URL}/posts/${post.slug}`,
      lastModified: formatPublishedDate(post.publishedAt),
    })) satisfies MetadataRoute.Sitemap;

  return [...routes, ...legals, ...posts];
};

export default sitemap;
