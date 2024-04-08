'use client';

import * as React from 'react';

import { Skeleton } from '@kkhys/ui';

import { api } from '#/lib/trpc/react';

export const ViewCounter = ({ slug }: { slug: string }) => {
  const utils = api.useUtils();

  const { mutate } = api.post.incrementViews.useMutation({
    onSuccess: async () => await utils.post.invalidate(),
  });

  const { data } = api.post.bySlug.useQuery({ slug });
  const views = data?.views;

  React.useEffect(() => mutate({ slug }), [mutate, slug]);

  if (!views) return <ViewCounterSkeleton />;

  return <p className='font-sans text-sm text-muted-foreground'>{views.toLocaleString()} views</p>;
};

export const ViewCounterSkeleton = () => <Skeleton className='h-4 w-14' />;
