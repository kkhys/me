import { AnimateNumber } from "@kkhys/ui/animate-number";
import { Skeleton } from "@kkhys/ui/skeleton";
import { incrementViews } from "#/app/posts/_lib/actions";
import { getPageViews } from "#/app/posts/_lib/queries";
import { env } from "#/env";

const renderViewCounter = (count: number) => (
  <div className="flex items-center gap-1 font-sans text-sm text-muted-foreground">
    <AnimateNumber count={count} /> views
  </div>
);

export const ViewCounter = async ({ slug }: { slug: string }) => {
  if (env.NODE_ENV === "development") {
    return renderViewCounter(12345);
  }

  const [pageViews] = await Promise.all([
    getPageViews({ slug }),
    incrementViews({ slug }),
  ]);

  return renderViewCounter(pageViews);
};

export const ViewCounterSkeleton = () => <Skeleton className="h-4 w-14" />;
