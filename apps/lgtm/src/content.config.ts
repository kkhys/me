import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { resolveLgtmBasePath } from "#/config/content-path";
import { lgtmDirLoader } from "#/loaders/lgtm-dir-loader";

const lgtmBasePath = resolveLgtmBasePath(process.env.USE_FIXTURE_DATA === "true");

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
