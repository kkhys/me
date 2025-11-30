import { getCollection } from "astro:content";
import { NODE_ENV } from "astro:env/client";

export const getPublishedMemos = async () => {
  const memos = await getCollection("memo");
  return memos
    .filter(({ data }) => NODE_ENV === "development" || !data.isDraft)
    .filter(({ body }) => body)
    .sort((a, b) => {
      const dateA = new Date(a.data.createdAt);
      const dateB = new Date(b.data.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
};
