import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const memoBasePath =
  process.env.USE_FIXTURE_DATA === "true"
    ? "./src/__fixtures__/memo-sample"
    : "./memo-content/memo";

const memo = defineCollection({
  loader: glob({ pattern: "**/index.md", base: memoBasePath }),
  schema: z.object({
    id: z.ulid(),
    createdAt: z.date(),
    tag: z
      .string()
      .min(1)
      .regex(/^[a-z0-9_]+$/)
      .optional(),
    comment: z.ulid().optional(),
    isDraft: z.boolean().default(false),
    author: z.string().default("kkhys"),
    hideLinkCard: z.boolean().default(false),
  }),
});

const users = defineCollection({
  loader: file("src/data/users.yaml"),
  schema: z.object({
    slug: z.string().regex(/^[a-z][a-z0-9_-]*$/),
    name: z.string(),
    bio: z.string().default(""),
    avatar: z.string(),
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
