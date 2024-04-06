'use client';

import { useEffect } from 'react';

import { Skeleton } from '@kkhys/ui';

import { api } from '#/lib/trpc/react';

export const ViewCounter = ({ slug }: { slug: string }) => {
  const { mutateAsync } = api.post.incrementViews.useMutation();
  const { data } = api.post.bySlug.useQuery({ slug });
  const views = data?.views;

  useEffect(() => {
    void (async () => {
      await mutateAsync({ slug });
    })();
  }, [mutateAsync, slug]);

  if (!views) return null;

  return <p className='font-sans text-sm text-muted-foreground'>{views.toLocaleString()} views</p>;
};

export const ViewCounterSkeleton = () => <Skeleton className='h-4 w-14' />;
