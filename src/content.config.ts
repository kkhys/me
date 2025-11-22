import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const memo = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./private_content/memo" }),
  schema: z.object({
    images: z.array(z.string()).max(4).optional(),
    createdAt: z.date(),
    createdAtString: z.string().optional(),
  }),
});

export const collections = { memo };
