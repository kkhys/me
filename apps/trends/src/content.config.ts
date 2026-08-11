import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const item = z.object({
  title: z.string(),
  // Japanese translation of an originally non-Japanese title; "" when the
  // title is already Japanese. Older runs predate the field.
  title_ja: z.string().default(""),
  url: z.url(),
  // Empty when the source has no separate discussion page.
  comments_url: z.string().default(""),
  score: z.number().int().min(0).max(100),
  engagement_label: z.string().default(""),
  category: z.string().default(""),
  interest: z.number().int().min(1).max(3),
  summary: z.string().default(""),
  discussion_summary: z.string().default(""),
  seen_before: z.boolean().default(false),
  extra: z.string().default(""),
});

const service = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(["ok", "error", "skipped"]),
  note: z.string().default(""),
  items: z.array(item),
});

const runs = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/runs" }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    generated_at: z.string(),
    digest: z
      .object({
        headline: z.string(),
        lead: z.string(),
        highlights: z.array(
          z.object({
            title: z.string(),
            title_ja: z.string().default(""),
            url: z.url(),
            service_label: z.string(),
            reason: z.string(),
          }),
        ),
      })
      // Reject retired fields (e.g. action_note) at build time so the
      // publishing skill and this schema cannot silently drift apart.
      .strict(),
    markets: z.array(
      z.object({
        id: z.enum(["japan", "global"]),
        label: z.string(),
        services: z.array(service),
      }),
    ),
  }),
});

export const collections = { runs };
