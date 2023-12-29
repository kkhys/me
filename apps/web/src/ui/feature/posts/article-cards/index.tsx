import * as React from 'react';
import { clsx } from 'clsx';
import type { Post } from 'contentlayer/generated';

import { ArticleCard } from '#/ui/feature/posts';

export const ArticleCards = ({ posts, className }: { posts: Post[]; className?: string }) => {
  if (!posts.length)
    return (
      <div className={className}>
        <p className='font-serif'>No posts found.</p>
      </div>
    );

  return (
    <div className={clsx('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3', className)}>
      {posts.map((post) => (
        <ArticleCard key={post._id} post={post} />
      ))}
    </div>
  );
};
