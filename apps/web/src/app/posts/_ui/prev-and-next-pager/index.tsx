import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { Button, Tooltip, TooltipContent, TooltipTrigger, cn } from "@kkhys/ui";
import { getPublicPostsAsc } from "#/utils/post";

export const PrevAndNextPager = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const pager = getPager(id);
  if (!pager) return null;

  const { prev, next } = pager;

  return (
    <div
      className={cn("flex items-center justify-between font-sans", className)}
    >
      {prev?.slug && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" asChild>
              <Link href={prev?.slug as Route}>
                <ChevronLeftIcon className="mr-2 size-4" />
                Prev
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{prev.title}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {next?.slug && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="ml-auto" variant="outline" asChild>
              <Link href={next.slug as Route}>
                Next
                <ChevronRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{next.title}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

const getPager = (targetId: string) => {
  const targetPosts = [...getPublicPostsAsc()];

  const activeIndex = targetPosts.findIndex((post) => targetId === post?._id);
  const prev = activeIndex !== 0 ? targetPosts[activeIndex - 1] : null;
  const next =
    activeIndex !== targetPosts.length - 1
      ? targetPosts[activeIndex + 1]
      : null;

  return { prev, next };
};
