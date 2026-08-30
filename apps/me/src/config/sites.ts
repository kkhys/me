import { me } from "#/config/site";

export type SatelliteSite = {
  label: string;
  href: string;
  description: string;
};

// Display order for /about and llms.txt: personal/creative sites first,
// tooling last.
export const sites = [
  {
    label: "Memo",
    href: me.memo,
    description: "日々のつぶやきを残す短文のメモ",
  },
  {
    label: "Diary",
    href: me.diary,
    description: "日付を添えた写真の記録",
  },
  {
    label: "Art",
    href: me.art,
    description: "描いた絵とファッションデザインの作品集",
  },
  {
    label: "Trends",
    href: me.trends,
    description: "国内外で話題になった技術記事を1日1回まとめるダイジェスト",
  },
  {
    label: "LGTM",
    href: me.lgtm,
    description: "GitHubのPRレビューで使うLGTM画像",
  },
  {
    label: "Design",
    href: me.design,
    description: "各サイトを支えるデザイントークンと共有コンポーネントのドキュメント",
  },
] as const satisfies SatelliteSite[];
