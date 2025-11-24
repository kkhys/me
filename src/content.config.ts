import { defineCollection, z } from "astro:content";
import { CI } from "astro:env/client";
import { glob } from "astro/loaders";

const memoBasePath =
  CI === "true" ? "./src/__fixtures__/memo-sample" : "./private-content/memo";

const memo = defineCollection({
  loader: glob({ pattern: "**/index.md", base: memoBasePath }),
  schema: z.object({
    id: z.string().ulid(),
    images: z.array(z.string()).max(4).optional(),
    createdAt: z.date(),
    isPublished: z.boolean().default(true),
    author: z.string().default("Keisuke Hayashi"),
  }),
});

export const collections = { memo };
