import { cn } from "@kkhys/ui/utils";
import type { Post } from "contentlayer/generated";
import { getCachedAllPageViewsSorted } from "#/app/posts/_lib/queries";
import { ArticleCard, ArticleCardSkeleton } from "#/app/posts/_ui/article-card";
import { getPostBySlug } from "#/utils/post";

const popularPostCount = 6;

const RankNumber = ({ rank }: { rank: number }) => (
  <div className="flex items-center justify-center absolute top-0 right-0 p-1 bg-secondary size-5">
    <span className="text-xs text-secondary-foreground font-sans tabular-nums">
      {rank}
    </span>
  </div>
);

export const PopularPosts = async ({ className }: { className?: string }) => {
  const allPageViewsSorted = await getCachedAllPageViewsSorted();
  const popularPosts = allPageViewsSorted
    .slice(0, popularPostCount)
    .map(({ slug }) => getPostBySlug(slug) as Post);

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:gap-4",
        className,
      )}
    >
      {popularPosts.map((post, index) => (
        <div key={post._id} className="relative">
          <ArticleCard post={post} />
          <RankNumber rank={index + 1} />
        </div>
      ))}
    </div>
  );
};

export const PopularPostsSkeleton = ({ className }: { className?: string }) => (
  <div>
    <div
      className={cn(
        "grid grid-cols-2 gap-3 xl:grid-cols-3 xl:gap-4",
        className,
      )}
    >
      {[...Array(popularPostCount)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={index} className="relative">
          <ArticleCardSkeleton />
          <RankNumber rank={index + 1} />
        </div>
      ))}
    </div>
  </div>
);
