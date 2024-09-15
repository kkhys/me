'use client';

import type { Post } from 'contentlayer/generated';
import type { Route } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cn } from '@kkhys/ui';

import { EyeCatch } from '#/ui/post';

const ArticleCard = ({ post }: { post: Post }) => {
  const { slug, title, emoji, publishedAtFormattedUs, status } = post;
  const MotionLink = motion(typeof Link);

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
          <CardDescription className='font-sans'>{publishedAtFormattedUs}</CardDescription>
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
    <div className={cn('grid grid-cols-2 gap-3 xl:grid-cols-3 xl:gap-4', className)}>
      {posts.map((post) => (
        <ArticleCard key={post._id} post={post} />
      ))}
    </div>
  );
};
