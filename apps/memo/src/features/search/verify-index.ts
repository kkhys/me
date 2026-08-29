import { readdir, readFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";
import { searchConfig } from "#/features/search/config";

export interface PagefindEntry {
  languages: Record<string, { page_count: number }>;
}

export const countIndexedPages = (entry: PagefindEntry): number =>
  Object.values(entry.languages).reduce((sum, language) => sum + language.page_count, 0);

// Every `/posts/<id>.html` carries `data-pagefind-body` and nothing else does,
// so the index must cover exactly that many pages. Fewer means some posts lost
// the attribute; more means it vanished everywhere and Pagefind fell back to
// indexing every page (feed, tags) without the meta the dialog renders.
export const assertIndexCoversPosts = ({
  indexed,
  posts,
}: {
  indexed: number;
  posts: number;
}): void => {
  if (posts === 0) throw new Error("Pagefind index check: no post pages were built");
  if (indexed !== posts) {
    throw new Error(`Pagefind index check: ${indexed} pages indexed, ${posts} post pages built`);
  }
};

// astro-pagefind logs an indexing failure and returns, so `astro build` still
// exits 0 and CI would deploy a `dist` with no `/pagefind/`. Registered after
// it in `integrations`, this hook turns that into a failed build.
export const verifyPagefindIndex = (): AstroIntegration => ({
  name: "verify-pagefind-index",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const entryUrl = new URL(`.${searchConfig.bundlePath}pagefind-entry.json`, dir);
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
      const posts = (await readdir(new URL("./posts/", dir))).filter((name) =>
        name.endsWith(".html"),
      ).length;
      assertIndexCoversPosts({ indexed, posts });
      logger.info(`Pagefind index covers all ${posts} post pages`);
    },
  },
});
