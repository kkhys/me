/* Group id of the product release notes: the h2 anchor and the first segment
   of its row anchors ({UPDATES_ID}-{product}-{rank}), the way a market id is. */
export const UPDATES_ID = "updates";
export const UPDATES_LABEL = "アップデート";

interface ProductRef {
  label: string;
  status: "ok" | "error" | "skipped";
  items: readonly unknown[];
}

/* Products with rows, or a failure worth showing, render as cards; the rest
   are named in one 更新なし line, so a quiet day is not seven empty cards. */
export const splitProducts = <T extends ProductRef>(
  products: readonly T[],
): { active: T[]; quiet: string[] } => ({
  active: products.filter((p) => p.items.length > 0 || p.status !== "ok"),
  quiet: products.filter((p) => p.items.length === 0 && p.status === "ok").map((p) => p.label),
});

const JST_DATE = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/* Publication day in JST, in the site's 2026.10.24 format; "" for feeds that
   date entries by month only, and for anything unparsable. */
export const formatUpdateDate = (iso: string): string => {
  const date = new Date(iso);

  return iso && !Number.isNaN(date.getTime()) ? JST_DATE.format(date).replaceAll("/", ".") : "";
};
