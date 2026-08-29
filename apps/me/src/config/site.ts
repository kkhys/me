export const siteConfig = {
  title: "Keisuke Hayashi",
  description: "Keisuke Hayashiの個人サイト",
  support: "https://coff.ee/kkhys",
  github: {
    me: "https://github.com/kkhys/me",
    content: "https://github.com/kkhys/content",
  },
} as const;

// Single source for how page titles/descriptions resolve, so <title> and
// og:title can never drift apart.
export const resolveTitle = (title?: string | undefined): string =>
  title ? `${title}｜${siteConfig.title}` : siteConfig.title;

export const resolveDescription = (description?: string | undefined): string =>
  description ?? siteConfig.description;

export const me = {
  name: "Keisuke Hayashi",
  email: "hi@kkhys.me",
  github: {
    id: "kkhys",
    url: "https://github.com/kkhys",
  },
  twitter: "@kkhys_",
  memo: "https://memo.kkhys.me",
  diary: "https://diary.kkhys.me",
  art: "https://art.kkhys.me",
  lgtm: "https://lgtm.kkhys.me",
  trends: "https://trends.kkhys.me",
  zenn: {
    url: "https://zenn.dev/kkhys",
    feed: "https://zenn.dev/kkhys/feed",
  },
} as const;
