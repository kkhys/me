import rss from "@astrojs/rss";

import type { APIContext } from "astro";
import { siteConfig } from "#/config/site.ts";
import { getCategoryBySlug } from "#/features/blog/config/category";
import { getPublicBlogEntries } from "#/features/blog/utils/entry";

export const GET = async (context: APIContext) =>
  rss({
    trailingSlash: false,
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? context.url.origin,
    items: (await getPublicBlogEntries()).map(({ id, data }) => ({
      title: data.title,
      pubDate: data.publishedAt,
      link: `/blog/posts/${id}`,
      categories: [getCategoryBySlug(data.category.toLowerCase())?.label ?? ""],
    })),
  });
