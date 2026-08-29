import { normalizePathname } from "@kkhys/seo/pathname";

export const normalizeQuery = (raw: string): string => raw.replaceAll(/\s+/gu, " ").trim();

// Pagefind derives result URLs from output file paths, and the site builds with
// `build.format: "file"`, so results arrive as `/posts/<id>.html`.
export const toResultHref = (url: string): string => normalizePathname(url);
