import { readdir, readFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import {
  assertIndexCoversPages,
  countIndexedPages,
  isDocPage,
  type PagefindEntry,
} from "../utils/pagefind-index";

// astro-pagefind logs an indexing failure and returns, so `astro build` still
// exits 0 and a `dist` with no `/pagefind/` would deploy. Registered after it
// in `integrations`, this hook turns that into a failed build.
export const verifyPagefindIndex = (): AstroIntegration => ({
  name: "verify-pagefind-index",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const entryUrl = new URL("./pagefind/pagefind-entry.json", dir);
      let raw: string;
      try {
        raw = await readFile(entryUrl, "utf8");
      } catch (error) {
        throw new Error(
          `Pagefind index check: ${entryUrl.pathname} is missing; did astro-pagefind fail?`,
          { cause: error },
        );
      }
      const indexed = countIndexedPages(JSON.parse(raw) as PagefindEntry);
      const pages = (await readdir(dir)).filter((name) => isDocPage(name)).length;
      assertIndexCoversPages({ indexed, pages });
      logger.info(`Pagefind index covers all ${pages} doc pages`);
    },
  },
});
