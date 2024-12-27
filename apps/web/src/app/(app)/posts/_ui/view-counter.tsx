import { Skeleton } from "@kkhys/ui";
import { getPageViews } from "#/app/(app)/posts/_lib";
import { env } from "#/env";

export const ViewCounter = async ({ slug }: { slug: string }) => {
  if (env.NODE_ENV === "development") {
    return <p className="font-sans text-sm text-muted-foreground">xxx views</p>;
  }

  const pageViews = await getPageViews({ slug });

  return (
    <p className="font-sans text-sm text-muted-foreground">
      {pageViews.toLocaleString()} views
    </p>
  );
};

export const ViewCounterSkeleton = () => <Skeleton className="h-4 w-14" />;
