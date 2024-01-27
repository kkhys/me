'use client';

import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { clsx } from 'clsx';
import type { Post } from 'contentlayer/generated';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/ui/data-display';
import { EyeCatch } from '#/ui/feature/posts';

const ArticleCard = ({ post }: { post: Post }) => {
  const { slug, title, emoji, publishedAtFormatted, status } = post;
  const MotionLink = motion(Link);

  return (
    <MotionLink
      href={`/posts/${slug}` as Route}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1.01 }}
      className='h-full'
    >
      <Card className='flex h-full flex-col justify-between'>
        <CardHeader className='flex flex-row justify-between'>
          <EyeCatch emoji={emoji} />
          {status === 'draft' && <span className='!m-0 font-sans text-xs text-red-400'>Draft</span>}
        </CardHeader>
        <CardContent>
          <CardTitle>{title}</CardTitle>
        </CardContent>
        <CardFooter>
          <CardDescription className='font-sans'>{publishedAtFormatted}</CardDescription>
        </CardFooter>
      </Card>
    </MotionLink>
  );
};

export const ArticleCards = ({ posts, className }: { posts: Post[]; className?: string }) => {
  if (!posts.length)
    return (
      <div className={className}>
        <p className='font-sans'>No posts found.</p>
      </div>
    );

  return (
    <div className={clsx('grid grid-cols-2 gap-3 xl:grid-cols-3 xl:gap-4', className)}>
      {posts.map((post) => (
        <ArticleCard key={post._id} post={post} />
      ))}
    </div>
  );
};
