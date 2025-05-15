export type Category = Record<"title" | "label" | "slug" | "emoji", string>;
export type CategoryTitle = (typeof categories)[number]["title"];

export const categories = [
  {
    title: "Tech",
    label: "プログラミング",
    slug: "tech",
    emoji: "🧑‍💻",
  },
  {
    title: "Life",
    label: "人生",
    slug: "life",
    emoji: "🕯",
  },
  {
    title: "Object",
    label: "モノ",
    slug: "object",
    emoji: "📦",
  },
  {
    title: "Build",
    label: "作る",
    slug: "build",
    emoji: "🏗",
  },
] as const satisfies Category[];

export const categoryTitles = categories.map(({ title }) => title);
