import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertIndexCoversPages,
  countFiles,
  countIndexedPages,
  verifyPagefindIndex,
} from "../verify-index";

describe("countIndexedPages", () => {
  it("sums the page counts across languages", () => {
    expect(
      countIndexedPages({ languages: { ja: { page_count: 690 }, en: { page_count: 5 } } }),
    ).toBe(695);
  });

  it("is zero for an index with no languages", () => {
    expect(countIndexedPages({ languages: {} })).toBe(0);
  });
});

describe("assertIndexCoversPages", () => {
  it("passes when the index covers every page", () => {
    expect(() =>
      assertIndexCoversPages({ indexed: 6, pages: 6, noun: "post pages" }),
    ).not.toThrow();
  });

  it("fails when pages are missing from the index", () => {
    expect(() => assertIndexCoversPages({ indexed: 0, pages: 6, noun: "post pages" })).toThrow(
      "0 pages indexed, 6 post pages built",
    );
  });

  it("fails when more than the indexable pages were indexed", () => {
    expect(() => assertIndexCoversPages({ indexed: 40, pages: 6, noun: "doc pages" })).toThrow(
      "40 pages indexed, 6 doc pages built",
    );
  });

  it("fails when no indexable pages exist at all", () => {
    expect(() => assertIndexCoversPages({ indexed: 0, pages: 0, noun: "post pages" })).toThrow(
      "no post pages were built",
    );
  });
});

const isHtml = (name: string) => name.endsWith(".html");

const runHook = async (dir: URL) => {
  const hook = verifyPagefindIndex({
    noun: "post pages",
    countPages: (out) => countFiles(new URL("./posts/", out), isHtml),
  }).hooks["astro:build:done"];
  if (!hook) throw new Error("astro:build:done hook is not registered");
  const logger = { info: vi.fn<(message: string) => void>() };
  await hook({ dir, logger } as unknown as Parameters<typeof hook>[0]);
  return logger;
};

describe("verifyPagefindIndex", () => {
  const dirs: string[] = [];

  const buildDir = async ({ posts, entry }: { posts: number; entry?: string | undefined }) => {
    const dir = await mkdtemp(join(tmpdir(), "verify-pagefind-"));
    dirs.push(dir);
    await mkdir(join(dir, "posts"));
    await Promise.all(
      Array.from({ length: posts }, (_, i) => writeFile(join(dir, "posts", `${i}.html`), "")),
    );
    await writeFile(join(dir, "posts", "notes.txt"), "");
    if (entry !== undefined) {
      await mkdir(join(dir, "pagefind"));
      await writeFile(join(dir, "pagefind", "pagefind-entry.json"), entry);
    }
    return pathToFileURL(`${dir}/`);
  };

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it("counts only the files the predicate accepts", async () => {
    const dir = await buildDir({ posts: 3 });
    expect(await countFiles(new URL("./posts/", dir), isHtml)).toBe(3);
  });

  it("reads the entry file and confirms the page count", async () => {
    const dir = await buildDir({
      posts: 3,
      entry: JSON.stringify({ languages: { ja: { page_count: 3 } } }),
    });
    const logger = await runHook(dir);
    expect(logger.info).toHaveBeenCalledWith("Pagefind index covers all 3 post pages");
  });

  it("fails the build when astro-pagefind wrote no bundle", async () => {
    const dir = await buildDir({ posts: 3 });
    await expect(runHook(dir)).rejects.toThrow(/pagefind-entry\.json is missing/u);
  });

  it("fails the build when the index and the pages disagree", async () => {
    const dir = await buildDir({
      posts: 3,
      entry: JSON.stringify({ languages: { ja: { page_count: 9 } } }),
    });
    await expect(runHook(dir)).rejects.toThrow("9 pages indexed, 3 post pages built");
  });
});
