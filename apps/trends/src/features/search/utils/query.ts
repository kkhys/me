import type { PagefindSearchOptions } from "@kkhys/search/types";
import { searchConfig } from "#/features/search/config";

export type SortMode = "relevance" | "date";

export const DEFAULT_SORT_MODE: SortMode = "relevance";

/** The persisted choice, or the default for anything else (unset, stale values). */
export const parseSortMode = (raw: string | null | undefined): SortMode =>
  raw === "date" ? "date" : DEFAULT_SORT_MODE;

// A Pagefind sort replaces relevance entirely, so 新しい順 is the newest
// matching days regardless of how strongly they matched.
export const buildSearchOptions = (mode: SortMode): PagefindSearchOptions =>
  mode === "date" ? { sort: { [searchConfig.sortKey]: "desc" } } : {};
