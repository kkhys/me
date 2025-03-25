import type { Legal, Post } from "contentlayer/generated";
import type { Tag } from "#/config/tag";

export type PostMetadataForEdge = Pick<Post, "title" | "emoji" | "slug">;

export type SearchItem = Pick<
  Post,
  "title" | "emojiSvg" | "category" | "tags" | "status"
> & { href: string };

export type PostMetadata = Pick<
  Post,
  | "_id"
  | "title"
  | "slug"
  | "emoji"
  | "category"
  | "tags"
  | "status"
  | "publishedAt"
  | "updatedAt"
  | "excerpt"
  | "url"
  | "editUrl"
  | "sourceUrl"
  | "revisionHistoryUrl"
>;

export type LegalMetadata = Pick<Legal, "title" | "slug" | "publishedAt">;

export type TagCloudItem = Tag & { emojiSvg: string };
