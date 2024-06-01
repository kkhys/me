'use client';

import type { Post } from 'contentlayer/generated';
import * as React from 'react';

import { useTimeDistance } from '#/hooks';

export const Time = ({ publishedAtFormattedUs, publishedAt }: Pick<Post, 'publishedAtFormattedUs' | 'publishedAt'>) => {
  const timeDistance = useTimeDistance(publishedAt);

  return (
    <time dateTime={publishedAt} className='font-sans text-sm text-muted-foreground'>
      {publishedAtFormattedUs}
      {timeDistance && `（${timeDistance} ago）`}
    </time>
  );
};
