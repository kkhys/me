import type { AstroIntegration } from "astro";
import { countFiles, verifyPagefindIndex as verifyIndex } from "@kkhys/search/verify-index";

/* The digest pages are `/<YYYY-MM-DD>.html` at the root of dist. `/` renders
   the same latest run without `data-pagefind-body`, and archive / about carry
   none either, so only the dated pages may be indexed. */
export const isDigestPage = (name: string): boolean => /^\d{4}-\d{2}-\d{2}\.html$/u.test(name);

export const verifyPagefindIndex = (): AstroIntegration =>
  verifyIndex({ noun: "digest pages", countPages: (dir) => countFiles(dir, isDigestPage) });
