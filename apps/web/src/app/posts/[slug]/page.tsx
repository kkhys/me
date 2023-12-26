import * as React from 'react';
import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';

import { ArticleLayout } from '#/ui/feature/posts';

export const generateStaticParams = () => allPosts.map(({ slug }) => ({ slug }));

export const generateMetadata = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
  };
};

const Page = ({ params: { slug } }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) notFound();

  return <ArticleLayout post={post} />;
};

export default Page;
