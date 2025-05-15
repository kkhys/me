import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string(),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z.date(),
    publishedAtString: z.string().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, legal };
