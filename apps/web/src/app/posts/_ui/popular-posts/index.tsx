import { cn } from "@kkhys/ui";
import type { Post } from "contentlayer/generated";
import { getCachedAllPageViewsSorted } from "#/app/posts/_lib";
import { ArticleCard, ArticleCardSkeleton } from "#/app/posts/_ui";
import { getPostBySlug } from "#/utils/post";

const popularPostCount = 6;

const RankNumber = ({ rank }: { rank: number }) => (
  <div className="absolute top-1 right-1 size-5">
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
      {Array.from({ length: popularPostCount }, (_, i) => (
        <div
          key={`popular-post-skeleton-${crypto.randomUUID()}`}
          className="relative"
        >
          <ArticleCardSkeleton />
          <RankNumber rank={i + 1} />
        </div>
      ))}
    </div>
  </div>
);
