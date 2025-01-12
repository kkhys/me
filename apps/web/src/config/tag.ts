export type Tag = Record<"title" | "slug" | "emoji", string>;
export type AllTagsTitle = (typeof tags)[keyof typeof tags][number]["title"];

export const tags = {
  build: [
    {
      title: "Desk",
      slug: "desk",
      emoji: "🪑",
    },
    {
      title: "Pottery",
      slug: "pottery",
      emoji: "🏺",
    },
    {
      title: "Clothes",
      slug: "clothes",
      emoji: "👗",
    },
    {
      title: "Sewing",
      slug: "sewing",
      emoji: "🪡",
    },
  ],
  life: [
    {
      title: "Travel",
      slug: "travel",
      emoji: "🌎",
    },
    {
      title: "Memorial",
      slug: "memorial",
      emoji: "🌸",
    },
    {
      title: "Essay",
      slug: "essay",
      emoji: "📝",
    },
    {
      title: "Poor writing",
      slug: "poor-writing",
      emoji: "🗑️",
    },
  ],
  object: [
    {
      title: "Desk",
      slug: "desk",
      emoji: "🪑",
    },
    {
      title: "Fashion",
      slug: "fashion",
      emoji: "👗",
    },
  ],
  tech: [
    {
      title: "Release",
      slug: "release",
      emoji: "🚀",
    },
    {
      title: "TypeScript",
      slug: "typescript",
      emoji: "📘",
    },
    {
      title: "React",
      slug: "react",
      emoji: "⚛️",
    },
    {
      title: "Play Framework",
      slug: "play-framework",
      emoji: "▶️",
    },
    {
      title: "Next.js",
      slug: "next-js",
      emoji: "🔼",
    },
    {
      title: "Security",
      slug: "security",
      emoji: "🔒",
    },
  ],
} satisfies Record<string, Tag[]>;

export const allTagTitles = Object.values(tags).flatMap((tag) =>
  tag.map((t) => t.title),
);
