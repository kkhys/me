/* Server-side twin of the client filter: the generated string is stored in
   data-text and matched with String.prototype.includes against the
   lowercased query. */
export const buildSearchText = (item: {
  title: string;
  summary: string;
  category: string;
  extra: string;
}): string =>
  [item.title, item.summary, item.category, item.extra]
    .join(" ")
    .toLowerCase()
    .replaceAll(/\s+/gu, " ")
    .trim();
