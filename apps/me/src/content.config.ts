import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { me } from "#/config/site";
import { categoryTitles } from "#/features/blog/config/category";
import { externalSites } from "#/features/blog/config/external-site";
import { allTagTitles } from "#/features/blog/config/tag";
import { zennLoader } from "#/lib/loaders/zenn";

// Blog content lives in the `me-content` git submodule. CI sets
// USE_FIXTURE_DATA so the build can be smoke-tested against a lightweight
// fixture directory without fetching the heavy submodule.
const contentDir =
  process.env.USE_FIXTURE_DATA === "true" ? "src/__fixtures__/content" : "me-content";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: `./${contentDir}/blog` }),
  schema: z.object({
    title: z.string(),
    emoji: z.string(),
    category: z.enum(categoryTitles),
    tags: z.array(z.enum(allTagTitles)).optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const bucketList = defineCollection({
  loader: file(`${contentDir}/bucket-list/data.yaml`),
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

const externalPost = defineCollection({
  loader: file("src/content/external-posts/data.yaml"),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    siteName: z.enum(externalSites),
    category: z.enum(categoryTitles),
    tags: z.array(z.enum(allTagTitles)).optional(),
    publishedAt: z.date(),
  }),
});

const zennPost = defineCollection({
  loader: zennLoader({ feedUrl: me.zenn.feed }),
  // Zenn posts are auto-fetched from the RSS feed, which carries no category or
  // tags, so siteName is fixed to "Zenn" and category to "Tech". To override a
  // specific article's category/tags, add a manual entry with the same URL to
  // the externalPost collection (it takes precedence in getPublicListEntries).
  schema: z.object({
    title: z.string(),
    url: z.url(),
    publishedAt: z.date(),
    siteName: z.literal("Zenn").default("Zenn"),
    category: z.literal("Tech").default("Tech"),
  }),
});

export const collections = { blog, pages, bucketList, externalPost, zennPost };
