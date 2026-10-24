import type { PagefindSubResult } from "@kkhys/search/types";

/**
 * Whether a Pagefind section is an item row: the h4 titles carry the row
 * anchors, while the h1 headline (no anchor), the h2 groups and the h3
 * sources are the page's framing. The dialog prefers a row so a hit lands on
 * the article, not on the day's headline that merely mentions it.
 */
export const isItemSection = (section: PagefindSubResult): boolean =>
  section.anchor?.element.toLowerCase() === "h4";
