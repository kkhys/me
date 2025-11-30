import { defineCollection, z } from "astro:content";
import { GITHUB_ACTIONS } from "astro:env/client";
import { glob } from "astro/loaders";

const memoBasePath = GITHUB_ACTIONS
  ? "./src/__fixtures__/memo-sample"
  : "./private-content/memo";

const memo = defineCollection({
  loader: glob({ pattern: "**/index.md", base: memoBasePath }),
  schema: z.object({
    id: z.string().ulid(),
    images: z.array(z.string()).max(4).optional(),
    createdAt: z.date(),
    isDraft: z.boolean().default(false),
    author: z.string().default("Keisuke Hayashi"),
    hideLinkCard: z.boolean().default(false),
  }),
});

export const collections = { memo };
