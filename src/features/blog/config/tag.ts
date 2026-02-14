export type Tag = Record<"title" | "label" | "slug" | "emoji", string>;

export const tags = [
  {
    title: "AI",
    label: "AI",
    slug: "ai",
    emoji: "🧠",
  },
  {
    title: "Apple",
    label: "Apple",
    slug: "apple",
    emoji: "🍎",
  },
  {
    title: "Camera",
    label: "カメラ",
    slug: "camera",
    emoji: "📷",
  },
  {
    title: "Clothes",
    label: "服",
    slug: "clothes",
    emoji: "👗",
  },
  {
    title: "Desk",
    label: "デスク",
    slug: "desk",
    emoji: "🪑",
  },
  {
    title: "Desk goods",
    label: "デスクグッズ",
    slug: "desk-goods",
    emoji: "✂",
  },
  {
    title: "Desk setup",
    label: "デスク周り",
    slug: "desk-setup",
    emoji: "🪑",
  },
  {
    title: "Environment",
    label: "環境構築",
    slug: "environment",
    emoji: "🌳",
  },
  {
    title: "Essay",
    label: "エッセイ",
    slug: "essay",
    emoji: "📝",
  },
  {
    title: "Event",
    label: "イベント",
    slug: "event",
    emoji: "🎉",
  },
  {
    title: "Font",
    label: "フォント",
    slug: "font",
    emoji: "🔤",
  },
  {
    title: "Gadget",
    label: "ガジェット",
    slug: "gadget",
    emoji: "📱",
  },
  {
    title: "Idea",
    label: "アイデア",
    slug: "idea",
    emoji: "💡",
  },
  {
    title: "Linux",
    label: "Linux",
    slug: "linux",
    emoji: "🐧",
  },
  {
    title: "Mastodon",
    label: "Mastodon",
    slug: "mastodon",
    emoji: "🐘",
  },
  {
    title: "Memorial",
    label: "思い出",
    slug: "memorial",
    emoji: "🌸",
  },
  {
    title: "Mermaid",
    label: "Mermaid",
    slug: "mermaid",
    emoji: "🧜",
  },
  {
    title: "Next.js",
    label: "Next.js",
    slug: "next-js",
    emoji: "🔼",
  },
  {
    title: "Play Framework",
    label: "Play Framework",
    slug: "play-framework",
    emoji: "▶",
  },
  {
    title: "Pottery",
    label: "陶芸",
    slug: "pottery",
    emoji: "🏺",
  },
  {
    title: "Random note",
    label: "雑記",
    slug: "random-note",
    emoji: "🗑",
  },
  {
    title: "React",
    label: "React",
    slug: "react",
    emoji: "⚛",
  },
  {
    title: "Release note",
    label: "リリースノート",
    slug: "release-note",
    emoji: "🚀",
  },
  {
    title: "Security",
    label: "セキュリティ",
    slug: "security",
    emoji: "🔒",
  },
  {
    title: "Sewing",
    label: "裁縫",
    slug: "sewing",
    emoji: "🪡",
  },
  {
    title: "Tips",
    label: "Tips",
    slug: "tips",
    emoji: "📌",
  },
  {
    title: "Travel",
    label: "旅行",
    slug: "travel",
    emoji: "🌎",
  },
  {
    title: "TypeScript",
    label: "TypeScript",
    slug: "typescript",
    emoji: "🧩",
  },
  {
    title: "Chocolate",
    label: "チョコレート",
    slug: "chocolate",
    emoji: "🍫",
  },
] as const satisfies Tag[];

export const allTagTitles = tags.map(({ title }) => title);

export const getTagBySlug = (slug: string) =>
  tags.find((tag) => tag.slug === slug);

export const getTagByTitle = (title: string) =>
  tags.find((tag) => tag.title === title);
