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

/**
 * Retrieves the previous and next posts based on a target post ID.
 *
 * @param targetId - The ID of the target post.
 * @returns An object containing the previous and next post, or null if there are none.
 */
const getPager = (targetId: string) => {
  const targetPosts = [
    ...allPosts
      .filter((post) => post.status === 'published')
      .filter((post) => post._id)
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()),
  ];

  const activeIndex = targetPosts.findIndex((post) => targetId === post?._id);
  const prev = activeIndex !== 0 ? targetPosts[activeIndex - 1] : null;
  const next = activeIndex !== targetPosts.length - 1 ? targetPosts[activeIndex + 1] : null;

  return { prev, next };
};
