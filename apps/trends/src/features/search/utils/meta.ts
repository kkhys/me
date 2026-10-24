import { searchConfig } from "#/features/search/config";

// `data-pagefind-meta` / `data-pagefind-sort` attribute values for a digest
// page. Pagefind parses an inline `key:value` capture up to the end of the
// attribute, so each attribute can carry only one.

/** The run date (YYYY-MM-DD) the dialog formats for the result row. */
export const buildDateMeta = (date: string): string => `${searchConfig.metaKeys.date}:${date}`;

/** The same date as a sort value; ISO dates order correctly as strings. */
export const buildDateSort = (date: string): string => `${searchConfig.sortKey}:${date}`;
