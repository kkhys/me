import type { PagefindSearchOptions } from "@kkhys/search/types";
import { searchConfig } from "#/features/search/config";

export const buildSearchOptions = (category: string | undefined): PagefindSearchOptions =>
  category ? { filters: { [searchConfig.filterKey]: category } } : {};
