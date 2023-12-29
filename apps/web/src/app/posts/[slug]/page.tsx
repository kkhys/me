import * as React from 'react';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';

import { serverEnv } from '#/env/index.mjs';
import { ArticleLayout } from '#/ui/feature/posts';

/**
 * Retrieves a post object by its slug.
 *
 * @param slug - The slug of the post to retrieve.
 * @returns The post object matching the given slug, or undefined if not found.
 */
const getPostBySlug = (slug: string) =>
  allPosts.find((post) => (serverEnv.NODE_ENV === 'development' || post.status === 'published') && post.slug === slug);

export const generateStaticParams = () =>
  allPosts
    .filter((post) => serverEnv.NODE_ENV === 'development' || post.status === 'published')
    .map(({ slug }) => ({ slug }));

export const generateMetadata = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { title, description, publishedAt, updatedAt } = post;
  const url = `${serverEnv.BASE_URL}/posts/${slug}`;

  return {
    title,
    description: description ?? undefined,
    alternates: {
      canonical: `${serverEnv.BASE_URL}/posts/${slug}`,
    },
    openGraph: {
      type: 'article',
      title,
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
      siteName: 'Keisuke Hayashi',
      locale: 'ja_JP',
    },
    twitter: {
      title,
      card: 'summary',
      siteId: '5237731',
      creator: '@kkhys_',
      creatorId: '5237731',
    },
  };
};

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <ArticleLayout post={post} />;
};

export default Page;
