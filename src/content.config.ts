import { defineCollection, z } from "astro:content";
import { GITHUB_ACTIONS } from "astro:env/client";
import { glob } from "astro/loaders";

const lgtmBasePath = GITHUB_ACTIONS
  ? "./src/__fixtures__/lgtm-sample"
  : "./private-content/lgtm";

const lgtm = defineCollection({
  loader: glob({ pattern: "**/index.md", base: lgtmBasePath }),
  schema: z.object({
    color: z.enum(["white", "black"]),
    image: z.string(),
    isDraft: z.boolean().default(false),
  }),
});

const legalPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  lang: z.enum(["en", "ja"]),
  lastUpdated: z.coerce.date(),
});

const privacy = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/privacy" }),
  schema: legalPageSchema,
});

const copyright = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/copyright" }),
  schema: legalPageSchema,
});

export const collections = { lgtm, privacy, copyright };
