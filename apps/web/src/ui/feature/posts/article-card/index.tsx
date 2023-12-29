'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Post } from 'contentlayer/generated';
import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/ui/data-display';
import { EyeCatch } from '#/ui/feature/posts';

export const ArticleCard = ({ post }: { post: Post }) => {
  const { slug, title, emoji, publishedAtFormatted, status } = post;
  const MotionLink = motion(Link);

  return (
    <MotionLink href={`/posts/${slug}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 1.01 }} className='h-full'>
      <Card className='flex h-full flex-col justify-between'>
        <CardHeader className='flex flex-row justify-between'>
          <EyeCatch emoji={emoji} />
          {status === 'draft' && <span className='!m-0 font-serif text-xs text-red-400'>Draft</span>}
        </CardHeader>
        <CardContent>
          <CardTitle>{title}</CardTitle>
        </CardContent>
        <CardFooter>
          <CardDescription className='font-serif'>{publishedAtFormatted}</CardDescription>
        </CardFooter>
      </Card>
    </MotionLink>
  );
};
