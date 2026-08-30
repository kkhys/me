/* Hand-curated meaning and call sites for the shared glyphs. The inventory
   itself is read from packages/ui/src/icons at build time; this file only
   annotates it, and pages/icons.astro fails the build on an entry whose
   glyph no longer exists. Re-check `usedBy` when an app drops or adds an
   import. */

export interface IconNote {
  /** What the glyph stands for across the sites. */
  role: string;
  /** Apps and shared components that import it; empty means unused. */
  usedBy: string[];
}

/* Order is the display order: navigation, actions, then the alert set. */
export const ICON_NOTES: Record<string, IconNote> = {
  search: { role: "検索を開く", usedBy: ["me", "memo", "@kkhys/search SearchDialog"] },
  "arrow-left": { role: "戻る", usedBy: ["lgtm", "@kkhys/ui SiteHeader"] },
  "move-up-right": { role: "外部リンク", usedBy: ["me"] },
  link: { role: "見出しのアンカー", usedBy: ["me"] },
  globe: { role: "favicon の代替", usedBy: ["@kkhys/ui LinkCard"] },
  check: { role: "完了・チェック済み", usedBy: ["me", "lgtm"] },
  copy: { role: "クリップボードへコピー", usedBy: ["lgtm"] },
  info: { role: "Alert: note", usedBy: ["me"] },
  lightbulb: { role: "Alert: tip", usedBy: ["me"] },
  "message-square-warning": { role: "Alert: important", usedBy: ["me"] },
  "triangle-alert": { role: "Alert: warning", usedBy: ["me"] },
  "octagon-alert": { role: "Alert: caution", usedBy: ["me"] },
};
