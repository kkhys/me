import type { AstroIntegration } from "astro";
import { countFiles, verifyPagefindIndex as verifyIndex } from "@kkhys/search/verify-index";
import { isDocPage } from "../utils/pagefind-index";

/* Every root page carries `data-pagefind-body` on <main> and nothing else does,
   so the index must cover exactly the root `.html` files; more means the
   previews leaked in. */
export const verifyPagefindIndex = (): AstroIntegration =>
  verifyIndex({ noun: "doc pages", countPages: (dir) => countFiles(dir, isDocPage) });
