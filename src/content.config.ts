import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const post = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/post" }),
  schema: z.object({
    title: z.string(),
    emoji: z.string().optional().default("📝"),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/legal" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { post, legal };
