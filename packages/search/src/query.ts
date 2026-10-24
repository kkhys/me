import { normalizePathname } from "@kkhys/seo/pathname";

export const normalizeQuery = (raw: string): string => raw.replaceAll(/\s+/gu, " ").trim();

// Pagefind derives result URLs from output file paths, and the sites build
// with `build.format: "file"`, so results arrive as `/<path>.html`.
export const toResultHref = (url: string): string => normalizePathname(url);

/** `toResultHref` for a sub-result URL, which may carry a `#heading` fragment. */
export const toSectionHref = (url: string): string => {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return toResultHref(url);
  return `${toResultHref(url.slice(0, hashIndex))}${url.slice(hashIndex)}`;
};
