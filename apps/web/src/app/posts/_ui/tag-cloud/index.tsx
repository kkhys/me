import { cn } from "@kkhys/ui";
import Link from "next/link";
import type { TagCloudItem as TagCloudItemType } from "#/app/posts/_types";

export const TagCloudItem = ({
  title,
  slug,
  emojiSvg,
}: Omit<TagCloudItemType, "emoji">) => (
  <Link
    href={`/posts/tags/${slug}`}
    className="inline-flex items-center gap-1.5 bg-muted/50 hover:bg-accent rounded-full border pl-1 pr-2.5 py-1 text-sm font-sans font-medium transition-colors duration-75 focus:outline-none"
  >
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: emojiSvg }}
      className="[&>svg]:size-4 rounded-full bg-muted/95 p-0.5"
    />
    <p className="whitespace-nowrap">{title}</p>
  </Link>
);

export const TagCloud = ({
  tags,
  className,
}: {
  tags: TagCloudItemType[];
  className?: string;
}) => (
  <div className={cn("flex flex-wrap gap-1.5", className)}>
    {tags.map((item) => (
      <TagCloudItem key={item.slug} {...item} />
    ))}
  </div>
);
