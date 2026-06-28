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
      .regex(/^[a-z0-9_]+$/u)
      .optional(),
    comment: z.ulid().optional(),
    quote: z.ulid().optional(),
    isDraft: z.boolean().default(false),
    author: z.string().default("kkhys"),
    hideLinkCard: z.boolean().default(false),
    isBot: z.boolean().default(false),
    isPinned: z.boolean().default(false),
    hideComments: z.boolean().default(false),
  }),
});

const usersPath =
  process.env.USE_FIXTURE_DATA === "true"
    ? "src/__fixtures__/users.yaml"
    : "memo-content/data/users.yaml";

const users = defineCollection({
  loader: file(usersPath),
  schema: z.object({
    slug: z.string().regex(/^[a-z][a-z0-9_-]*$/u),
    name: z.string(),
    bio: z.string().default(""),
    avatar: z.string(),
    cover: z.string().optional(),
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
