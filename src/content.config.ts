import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";
import { categoryTitles } from "#/features/blog/config/category";
import { allTagTitles } from "#/features/blog/config/tag";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string(),
    category: z.enum(categoryTitles as [string, ...string[]]),
    tags: z.array(z.enum(allTagTitles as [string, ...string[]])).optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z.date(),
    publishedAtString: z.string().optional(),
    updatedAt: z.date().optional(),
    updatedAtString: z.string().optional(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const bucketList = defineCollection({
  loader: file("content/bucket-list/data.yaml"),
  schema: z.array(
    z.record(
      z.string(),
      z.array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          completedAt: z.date().optional(),
        }),
      ),
    ),
  ),
});

export const collections = { blog, legal, bucketList };
