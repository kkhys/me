export type Category = Record<"title" | "slug" | "emoji", string>;
export type CategoryTitle = (typeof categories)[number]["title"];

export const categories = [
  {
    title: "Tech",
    slug: "tech",
    emoji: "👩",
  },
  {
    title: "Life",
    slug: "life",
    emoji: "🕯",
  },
  {
    title: "Object",
    slug: "object",
    emoji: "📦",
  },
  {
    title: "Build",
    slug: "build",
    emoji: "🏗",
  },
] satisfies Category[];

export const categoryTitles = categories.map(({ title }) => title);
