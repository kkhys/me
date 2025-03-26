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
      title: "Random note",
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
      slug: "camera",
      emoji: "📷",
    },
    {
      title: "Desk setup",
      slug: "desk-setup",
      emoji: "🪑",
    },
    {
      title: "Desk goods",
      slug: "desk-goods",
      emoji: "✂",
    },
    {
      title: "Gadget",
      slug: "gadget",
      emoji: "📱",
    },
    {
      title: "Apple",
      slug: "apple",
      emoji: "🍎",
    },
  ],
  tech: [
    {
      title: "Release note",
      slug: "release-note",
      emoji: "🚀",
    },
    {
      title: "TypeScript",
      slug: "typescript",
      emoji: "🧩",
    },
    {
      title: "React",
      slug: "react",
      emoji: "⚛",
    },
    {
      title: "Play Framework",
      slug: "play-framework",
      emoji: "▶",
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
    {
      title: "Idea",
      slug: "idea",
      emoji: "💡",
    },
    {
      title: "Font",
      slug: "font",
      emoji: "🔤",
    },
    {
      title: "Mermaid",
      slug: "mermaid",
      emoji: "🧜",
    },
    {
      title: "Tips",
      slug: "tips",
      emoji: "📌",
    },
    {
      title: "Mastodon",
      slug: "mastodon",
      emoji: "🐘",
    },
    {
      title: "Linux",
      slug: "linux",
      emoji: "🐧",
    },
    {
      title: "Environment",
      slug: "environment",
      emoji: "🌳",
    },
  ],
} satisfies Record<string, Tag[]>;

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
