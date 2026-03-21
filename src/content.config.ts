import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { memoLoader } from "./loaders/memo-loader";

const memo = defineCollection({
  loader: memoLoader(),
  schema: z.object({
    id: z.string().min(1),
    createdAt: z.date(),
    tag: z
      .string()
      .min(1)
      .regex(/^[a-z0-9_]+$/)
      .optional(),
    comment: z.ulid().optional(),
    quote: z.ulid().optional(),
    isDraft: z.boolean().default(false),
    author: z.string().default("kkhys"),
    hideLinkCard: z.boolean().default(false),
    isBot: z.boolean().default(false),
  }),
});

const users = defineCollection({
  loader: file("src/data/users.yaml"),
  schema: z.object({
    slug: z.string().regex(/^[a-z][a-z0-9_-]*$/),
    name: z.string(),
    bio: z.string().default(""),
    avatar: z.string(),
    isBot: z.boolean().default(false),
    links: z
      .array(
        z.object({
          type: z.enum(["website", "github"]),
          url: z.string().url(),
        }),
      )
      .default([]),
  }),
});

export const collections = { memo, users };
