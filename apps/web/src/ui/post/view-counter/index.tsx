'use client';

import * as React from 'react';

import { Skeleton } from '@kkhys/ui';

import { api } from '#/lib/trpc/react';

export const ViewCounter = ({ slug }: { slug: string }) => {
  const { mutateAsync } = api.post.incrementViews.useMutation();

  React.useEffect(() => {
    void (async () => {
      await mutateAsync({ slug });
    })();
  }, [mutateAsync, slug]);

  const { data } = api.post.bySlug.useQuery({ slug });
  const views = data?.views;

  if (!views) return null;

  return <p className='font-sans text-sm text-muted-foreground'>{views.toLocaleString()} views</p>;
};

export const ViewCounterSkeleton = () => <Skeleton className='h-4 w-14' />;
