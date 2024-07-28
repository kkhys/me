'use client';

import * as React from 'react';

import { Skeleton } from '@kkhys/ui';

import { api } from '#/lib/trpc/react';

export const ViewCounter = ({ slug }: { slug: string }) => {
  const utils = api.useUtils();

  const { mutate } = api.pageView.incrementViews.useMutation({
    onSuccess: async (status) => {
      if (status === 'Incremented') {
        await utils.pageView.bySlug.invalidate({ slug });
      }
    },
  });

  const { data } = api.pageView.bySlug.useQuery({ slug }, { staleTime: 60 * 1000 });

  React.useEffect(() => mutate({ slug }), [mutate, slug]);

  if (!data) return <ViewCounterSkeleton />;

  return <p className='font-sans text-sm text-muted-foreground'>{data.toLocaleString()} views</p>;
};

export const ViewCounterSkeleton = () => <Skeleton className='h-4 w-14' />;
