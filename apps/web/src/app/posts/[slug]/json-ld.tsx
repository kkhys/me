import type { Post } from 'contentlayer/generated';
import type { BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';
import * as React from 'react';

import { me, site } from '#/config';

export const JsonLd = ({ post }: { post: Post }) => {
  const url = `${site.url.base}/posts/${post.slug}`;

  /**
   * @see https://developers.google.com/search/docs/appearance/structured-data/article
   */
  const jsonLdBlogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: [
      {
        '@type': 'Person',
        name: me.name,
        url: site.url.base,
      },
    ],
    dateModified: post.updatedAt ?? undefined,
    datePublished: post.publishedAt,
    headline: post.title,
    image: `${url}/opengraph-image/default`,
  } satisfies WithContext<BlogPosting>;

  /**
   * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
   */
  const jsonLdBreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: site.title,
        item: site.url.base,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Posts',
        item: `${site.url.base}/posts`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLdBlogPosting, jsonLdBreadcrumbList]) }}
    />
  );
};
