import { normalizePathname } from "@kkhys/seo/pathname";
import type { PagefindSearchOptions } from "#/features/search/types";

export const normalizeQuery = (raw: string): string => raw.replaceAll(/\s+/gu, " ").trim();

export const buildSearchOptions = (category: string | undefined): PagefindSearchOptions =>
  category ? { filters: { category } } : {};

// Pagefind derives result URLs from output file paths, and the site builds with
// `build.format: "file"`, so results arrive as `/blog/posts/<id>.html`.
export const toResultHref = (url: string): string => normalizePathname(url);
