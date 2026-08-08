type Category = Record<"title" | "label" | "slug" | "emoji", string>;
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
    title: "DIY",
    label: "DIY",
    slug: "diy",
    emoji: "🔨",
  },
] as const satisfies Category[];

// Restore the tuple shape map() erases so z.enum keeps the literal types.
export const categoryTitles = categories.map(({ title }) => title) as [
  CategoryTitle,
  ...CategoryTitle[],
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

export const getCategoryByTitle = (title: string) =>
  categories.find((category) => category.title === title);
