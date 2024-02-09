import * as React from 'react';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';

import { env } from '#/env.mjs';
import { ArticleLayout } from '#/ui/feature/posts';
import { JsonLd } from './json-ld';

import '#/styles/code-block.css';

/**
 * Retrieves a post object by its slug.
 *
 * @param slug - The slug of the post to retrieve.
 * @returns The post object matching the given slug, or undefined if not found.
 */
const getPostBySlug = (slug: string) =>
  allPosts.find((post) => (env.NODE_ENV === 'development' || post.status === 'published') && post.slug === slug);

export const generateStaticParams = () =>
  allPosts
    .filter((post) => env.NODE_ENV === 'development' || post.status === 'published')
    .map(({ slug }) => ({ slug }));

export const generateMetadata = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { title, excerpt, publishedAt, updatedAt } = post;
  const url = `/posts/${slug}`;

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      type: 'article',
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
    },
  };
};

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd post={post} />
      <ArticleLayout post={post} />
    </>
  );
};

export default Page;
