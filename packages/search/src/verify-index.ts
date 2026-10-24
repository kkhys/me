import { readdir, readFile } from "node:fs/promises";
import type { AstroIntegration } from "astro";

export interface PagefindEntry {
  languages: Record<string, { page_count: number }>;
}

export const countIndexedPages = (entry: PagefindEntry): number =>
  Object.values(entry.languages).reduce((sum, language) => sum + language.page_count, 0);

export interface IndexCoverage {
  indexed: number;
  pages: number;
  /** What the indexable pages are called in the messages, e.g. "post pages". */
  noun: string;
}

// The indexable pages carry `data-pagefind-body` and nothing else does, so the
// index must cover exactly that many. Fewer means a page lost the attribute;
// more means it vanished everywhere and Pagefind fell back to indexing every
// document, without the meta the dialog renders.
export const assertIndexCoversPages = ({ indexed, pages, noun }: IndexCoverage): void => {
  if (pages === 0) throw new Error(`Pagefind index check: no ${noun} were built`);
  if (indexed !== pages) {
    throw new Error(`Pagefind index check: ${indexed} pages indexed, ${pages} ${noun} built`);
  }
};

/** Number of entries of the directory `dir` whose name passes `isPage`. */
export const countFiles = async (dir: URL, isPage: (name: string) => boolean): Promise<number> =>
  (await readdir(dir)).filter((name) => isPage(name)).length;

export interface VerifyIndexOptions {
  /** What the indexable pages are called in the messages, e.g. "post pages". */
  noun: string;
  /** Counts the built pages that carry `data-pagefind-body`; `dir` is the output directory. */
  countPages: (dir: URL) => Promise<number>;
}

// astro-pagefind logs an indexing failure and returns, so `astro build` still
// exits 0 and a `dist` with no `/pagefind/` would deploy. Registered after it
// in `integrations`, this hook turns that into a failed build. The bundle path
// is fixed by astro-pagefind (`<outDir>/pagefind`).
export const verifyPagefindIndex = ({
  noun,
  countPages,
}: VerifyIndexOptions): AstroIntegration => ({
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
      const pages = await countPages(dir);
      assertIndexCoversPages({ indexed, pages, noun });
      logger.info(`Pagefind index covers all ${pages} ${noun}`);
    },
  },
});
