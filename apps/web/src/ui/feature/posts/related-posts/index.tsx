import * as React from 'react';
import type { Post } from 'contentlayer/generated';

import { ArticleList } from '#/ui/feature/posts';

export const RelatedPosts = ({ relatedPosts, className }: { relatedPosts: Post[]; className?: string }) => {
  if (!relatedPosts.length) return null;

  return (
    <div className={className}>
      <hr className='mt-12' />
      <span className='mt-12 block font-sans text-xl font-medium'>Related Posts</span>
      <ArticleList className='mt-6' posts={relatedPosts} showDate={false} />
    </div>
  );
};
