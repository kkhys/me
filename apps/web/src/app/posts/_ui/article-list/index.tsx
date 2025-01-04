import { cn } from "@kkhys/ui";
import type { Post } from "contentlayer/generated";
import type { Route } from "next";
import Link from "next/link";
import { EyeCatch } from "#/app/posts/_ui";

const ListItem = ({
  post: { slug, title, publishedAt, publishedAtFormattedIso, status, emojiSvg },
  showDate,
}: {
  post: Post;
  showDate: boolean;
}) => (
  <Link
    href={`/posts/${slug}` as Route}
    className="relative flex items-center justify-between gap-x-4 px-2 py-3 transition-colors hover:bg-muted/50"
  >
    <div className="flex items-center gap-x-4">
      <EyeCatch emoji={emojiSvg} size="sm" className="shrink-0" />
      <p className="palt">{title}</p>
    </div>
    {showDate && (
      <time
        className="shrink-0 font-sans text-sm tabular-nums text-muted-foreground"
        dateTime={publishedAt}
      >
        {publishedAtFormattedIso}
      </time>
    )}
    {status === "draft" && (
      <span className="absolute right-0 top-0 h-1 w-2 bg-red-400/80" />
    )}
  </Link>
);

export const ArticleList = ({
  posts,
  showDate = true,
  className,
}: {
  posts: Post[];
  showDate?: boolean;
  className?: string;
}) => {
  if (!posts.length)
    return (
      <div className={className}>
        <p className="font-sans">No posts found.</p>
      </div>
    );

  return (
    <div className={cn("divide-y border-t", className)}>
      {posts.map((post) => (
        <ListItem key={post._id} post={post} showDate={showDate} />
      ))}
    </div>
  );
};
