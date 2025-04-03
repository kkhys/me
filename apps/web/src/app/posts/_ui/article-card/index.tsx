import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@kkhys/ui/card";
import { Skeleton } from "@kkhys/ui/skeleton";
import { cn } from "@kkhys/ui/utils";
import type { Post } from "contentlayer/generated";
import type { Route } from "next";
import Link from "next/link";
import { EyeCatch, EyeCatchSkeleton } from "#/app/posts/_ui/eye-catch";

export const ArticleCard = ({
  post: { slug, title, emojiSvg, publishedAt, publishedAtFormattedIso },
  className,
  ...props
}: { post: Post } & React.ComponentProps<typeof Card>) => (
  <Link href={`/posts/${slug}` as Route}>
    <Card
      className={cn(
        "flex h-full flex-col justify-between hover:bg-accent/50",
        className,
      )}
      {...props}
    >
      <CardHeader className="pb-3">
        <EyeCatch emoji={emojiSvg} size="sm" className="rounded-full" />
      </CardHeader>
      <CardContent className="pb-3">
        <p className="palt">{title}</p>
      </CardContent>
      <CardFooter>
        <CardDescription>
          <time className="font-sans tabular-nums" dateTime={publishedAt}>
            {publishedAtFormattedIso}
          </time>
        </CardDescription>
      </CardFooter>
    </Card>
  </Link>
);

export const ArticleCardSkeleton = () => (
  <Card className="flex h-full flex-col justify-between hover:bg-accent/50">
    <CardHeader className="pb-3">
      <EyeCatchSkeleton size="sm" className="rounded-full" />
    </CardHeader>
    <CardContent className="pb-3 space-y-2">
      {[...Array(3)].map(() => (
        <Skeleton
          key={`skeleton-${crypto.randomUUID()}`}
          className="h-[1.27rem] w-full"
        />
      ))}
    </CardContent>
    <CardFooter>
      <CardDescription>
        <Skeleton className="h-4 w-20" />
      </CardDescription>
    </CardFooter>
  </Card>
);
