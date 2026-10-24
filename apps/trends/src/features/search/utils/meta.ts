import { searchConfig } from "#/features/search/config";

// `data-pagefind-meta` / `data-pagefind-sort` attribute values for a digest
// page. Pagefind parses an inline `key:value` capture up to the end of the
// attribute, so each attribute can carry only one.

/** The run date (YYYY-MM-DD) the dialog formats for the result row. */
export const buildDateMeta = (date: string): string => `${searchConfig.metaKeys.date}:${date}`;

/** The same date as a sort value; ISO dates order correctly as strings. */
export const buildDateSort = (date: string): string => `${searchConfig.sortKey}:${date}`;

/** The run's month (YYYY-MM) as a filter value, so a search can be held to a few months. */
export const buildMonthFilter = (date: string): string =>
  `${searchConfig.filterKeys.month}:${date.slice(0, 7)}`;
