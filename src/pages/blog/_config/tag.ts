import type { CategoryTitle } from "#/pages/blog/_config/category.ts";

export type Tag = Record<"title" | "label" | "slug" | "emoji", string>;
export type AllTagsTitle = (typeof tags)[keyof typeof tags][number]["title"];

export const tags = {
  build: [
    {
      title: "Desk",
      label: "デスク",
      slug: "desk",
      emoji: "🪑",
    },
    {
      title: "Pottery",
      label: "陶芸",
      slug: "pottery",
      emoji: "🏺",
    },
    {
      title: "Clothes",
      label: "服",
      slug: "clothes",
      emoji: "👗",
    },
    {
      title: "Sewing",
      label: "裁縫",
      slug: "sewing",
      emoji: "🪡",
    },
  ],
  life: [
    {
      title: "Travel",
      label: "旅行",
      slug: "travel",
      emoji: "🌎",
    },
    {
      title: "Memorial",
      label: "思い出",
      slug: "memorial",
      emoji: "🌸",
    },
    {
      title: "Essay",
      label: "エッセイ",
      slug: "essay",
      emoji: "📝",
    },
    {
      title: "Random note",
      label: "雑記",
      slug: "random-note",
      emoji: "🗑",
    },
  ],
  object: [
    // {
    //   title: "Fashion",
    //   slug: "fashion",
    //   emoji: "👗",
    // },
    {
      title: "Camera",
      label: "カメラ",
      slug: "camera",
      emoji: "📷",
    },
    {
      title: "Desk setup",
      label: "デスク周り",
      slug: "desk-setup",
      emoji: "🪑",
    },
    {
      title: "Desk goods",
      label: "デスクグッズ",
      slug: "desk-goods",
      emoji: "✂",
    },
    {
      title: "Gadget",
      label: "ガジェット",
      slug: "gadget",
      emoji: "📱",
    },
    {
      title: "Apple",
      label: "Apple",
      slug: "apple",
      emoji: "🍎",
    },
  ],
  tech: [
    {
      title: "Release note",
      label: "リリースノート",
      slug: "release-note",
      emoji: "🚀",
    },
    {
      title: "TypeScript",
      label: "TypeScript",
      slug: "typescript",
      emoji: "🧩",
    },
    {
      title: "React",
      label: "React",
      slug: "react",
      emoji: "⚛",
    },
    {
      title: "Play Framework",
      label: "Play Framework",
      slug: "play-framework",
      emoji: "▶",
    },
    {
      title: "Next.js",
      label: "Next.js",
      slug: "next-js",
      emoji: "🔼",
    },
    {
      title: "Security",
      label: "セキュリティ",
      slug: "security",
      emoji: "🔒",
    },
    {
      title: "Idea",
      label: "アイデア",
      slug: "idea",
      emoji: "💡",
    },
    {
      title: "Font",
      label: "フォント",
      slug: "font",
      emoji: "🔤",
    },
    {
      title: "Mermaid",
      label: "Mermaid",
      slug: "mermaid",
      emoji: "🧜",
    },
    {
      title: "Tips",
      label: "Tips",
      slug: "tips",
      emoji: "📌",
    },
    {
      title: "Mastodon",
      label: "Mastodon",
      slug: "mastodon",
      emoji: "🐘",
    },
    {
      title: "Linux",
      label: "Linux",
      slug: "linux",
      emoji: "🐧",
    },
    {
      title: "Environment",
      label: "環境構築",
      slug: "environment",
      emoji: "🌳",
    },
  ],
} as const satisfies Record<string, Tag[]>;

export const flatTags = Object.values(tags).flat();

export const allTagTitles = flatTags.map(({ title }) => title);

export const extractCategoryByTagTitle = (title: string) => {
  for (const [categoryName, tagList] of Object.entries(tags)) {
    if (tagList.some((tag) => tag.title === title)) {
      return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    }
  }
  return undefined;
};

export const tagsTitlesByCategory: Record<CategoryTitle, string[]> = {
  Tech: tags.tech.map((t) => t.title),
  Life: tags.life.map((t) => t.title),
  Object: tags.object.map((t) => t.title),
  Build: tags.build.map((t) => t.title),
};
