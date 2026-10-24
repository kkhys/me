import type { AstroIntegration } from "astro";
import { countFiles, verifyPagefindIndex as verifyIndex } from "@kkhys/search/verify-index";

const isPostPage = (name: string): boolean => name.endsWith(".html");

/* Every `/posts/<id>.html` carries `data-pagefind-body` and nothing else does,
   so the index must cover exactly the post pages; more means the attribute
   vanished and the feed and tag pages leaked in. */
export const verifyPagefindIndex = (): AstroIntegration =>
  verifyIndex({
    noun: "post pages",
    countPages: (dir) => countFiles(new URL("./posts/", dir), isPostPage),
  });
