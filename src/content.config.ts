import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const memoBasePath =
  process.env.USE_FIXTURE_DATA === "true"
    ? "./src/__fixtures__/memo-sample"
    : "./memo-content/memo";

const memo = defineCollection({
  loader: glob({ pattern: "**/index.md", base: memoBasePath }),
  schema: z.object({
    id: z.string().ulid(),
    createdAt: z.date(),
    tag: z
      .string()
      .min(1)
      .regex(/^[a-z0-9_]+$/)
      .optional(),
    images: z.array(z.string()).max(4).optional(),
    comment: z.string().ulid().optional(),
    isDraft: z.boolean().default(false),
    author: z.string().default("Keisuke Hayashi"),
    hideLinkCard: z.boolean().default(false),
  }),
});

export const collections = { memo };
