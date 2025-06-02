import { getCollection } from "astro:content";
import { NODE_ENV } from "astro:env/client";

export const getPublicBlogEntries = async (sort: "asc" | "desc" = "desc") => {
  const entries = await getCollection("blog");

  return entries
    .filter(
      ({ data }) => NODE_ENV === "development" || data.status === "published",
    )
    .sort((a, b) => {
      const dateA = new Date(a.data.publishedAt).getTime();
      const dateB = new Date(b.data.publishedAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
};
