import { defineCollection } from "astro:content";
import { GITHUB_ACTIONS } from "astro:env/client";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { lgtmDirLoader } from "#/loaders/lgtm-dir-loader";

const lgtmBasePath = GITHUB_ACTIONS
  ? "./src/__fixtures__/lgtm-sample"
  : "./lgtm-content/lgtm";

const lgtm = defineCollection({
  loader: lgtmDirLoader({ base: lgtmBasePath }),
  schema: z.object({
    image: z.string(),
    animated: z.boolean(),
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
