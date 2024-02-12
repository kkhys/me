import type { Route } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { allPosts } from 'contentlayer/generated';

import { cn } from '#/lib/shadcn-ui/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/data-display';
import { Button } from '#/ui/general';

export const PrevAndNextPager = ({ id, className }: { id: string; className?: string }) => {
  const pager = getPager(id);
  if (!pager) return null;

  const { prev, next } = pager;

  return (
    <div className={cn('flex items-center justify-between font-sans', className)}>
      {prev?.slug && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' asChild>
                <Link href={prev?.slug as Route}>
                  <ChevronLeftIcon className='mr-2 size-4' />
                  Prev
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{prev.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {next?.slug && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className='ml-auto' variant='outline' asChild>
                <Link href={next.slug as Route}>
                  Next
                  <ChevronRightIcon className='ml-2 size-4' />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{next.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

const getPager = (targetId: string) => {
  const targetPosts = [
    null,
    ...allPosts.filter((post) => post.status === 'published').filter((post) => post._id),
    null,
  ];
  const activeIndex = targetPosts.findIndex((post) => targetId === post?._id);
  const prev = activeIndex !== 0 ? targetPosts[activeIndex - 1] : null;
  const next = activeIndex !== targetPosts.length - 1 ? targetPosts[activeIndex + 1] : null;
  return { prev, next };
};
