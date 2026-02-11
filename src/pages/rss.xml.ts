import rss from "@astrojs/rss";

import type { APIContext } from "astro";
import { siteConfig } from "#/config/site";
import { getCategoryBySlug } from "#/features/blog/config/category";
import { getPublicBlogEntries } from "#/features/blog/utils/entry";
import { extractDescription } from "#/utils/extract-description";

export const GET = async (context: APIContext) =>
  rss({
    trailingSlash: false,
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? context.url.origin,
    items: (await getPublicBlogEntries()).map(({ id, data, body }) => ({
      title: data.title,
      description: extractDescription(body ?? ""),
      pubDate: data.publishedAt,
      link: `/blog/posts/${id}`,
      categories: [getCategoryBySlug(data.category.toLowerCase())?.label ?? ""],
    })),
  });
