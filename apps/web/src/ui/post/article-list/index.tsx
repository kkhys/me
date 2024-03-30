import type { Post } from 'contentlayer/generated';
import * as React from 'react';
import Link from 'next/link';

import { cn } from '@kkhys/ui';

import { EyeCatch } from '#/ui/post';

const ListItem = ({
  post: { slug, emoji, title, publishedAt, publishedAtFormattedIso, status },
  showDate,
}: {
  post: Post;
  showDate: boolean;
}) => {
  return (
    <Link
      href={`/posts/${slug}`}
      className='relative flex items-center justify-between gap-x-4 px-2 py-3 transition-colors hover:bg-muted/50'
    >
      <div className='flex items-center gap-x-4'>
        <EyeCatch emoji={emoji} size='sm' className='shrink-0' />
        <p className='palt'>{title}</p>
      </div>
      {showDate && (
        <time className='shrink-0 font-sans text-sm tabular-nums text-muted-foreground' dateTime={publishedAt}>
          {publishedAtFormattedIso}
        </time>
      )}
      {status === 'draft' && <span className='absolute right-0 top-0 h-1 w-2 bg-red-400/80' />}
    </Link>
  );
};

export const ArticleList = ({
  posts,
  className,
  showDate = true,
}: {
  posts: Post[];
  className?: string;
  showDate?: boolean;
}) => {
  if (!posts.length)
    return (
      <div className={className}>
        <p className='font-sans'>No posts found.</p>
      </div>
    );

  return (
    <div className={cn('divide-y border-t', className)}>
      {posts.map((post) => (
        <ListItem key={post._id} post={post} showDate={showDate} />
      ))}
    </div>
  );
};
