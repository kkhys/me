import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { parse } from "yaml";
import { resolveContentBase, useFixtureData } from "#/config/content-path";

const base = resolveContentBase(useFixtureData());

// The data store hands entries back sorted by id, so the YAML position has to
// travel with each item for it to double as the display order.
const orderedYaml = (text: string) => {
  const items: unknown = parse(text);
  if (!Array.isArray(items)) {
    throw new TypeError("Caption files must be a YAML array.");
  }
  return items.map((item: unknown, order) => {
    if (typeof item !== "object" || item === null) {
      throw new TypeError(`Caption at position ${order} must be a mapping.`);
    }
    return Object.assign(item, { order });
  });
};

// The slug doubles as the image file (works) or directory (fashion) name.
const captionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  order: z.number().int().nonnegative(),
});

const works = defineCollection({
  loader: file(`${base}/works/works.yaml`, { parser: orderedYaml }),
  schema: captionSchema,
});

const fashion = defineCollection({
  loader: file(`${base}/fashion/fashion.yaml`, { parser: orderedYaml }),
  schema: captionSchema,
});

export const collections = { works, fashion };
