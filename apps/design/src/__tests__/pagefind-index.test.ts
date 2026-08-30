import { describe, expect, it } from "vitest";
import { assertIndexCoversPages, countIndexedPages, isDocPage } from "#/utils/pagefind-index";

describe("countIndexedPages", () => {
  it("sums page counts across languages", () => {
    expect(countIndexedPages({ languages: { ja: { page_count: 6 }, en: { page_count: 2 } } })).toBe(
      8,
    );
  });

  it("is 0 for an empty index", () => {
    expect(countIndexedPages({ languages: {} })).toBe(0);
  });
});

describe("isDocPage", () => {
  it("keeps the html files and drops assets and directories", () => {
    expect(
      ["index.html", "components.html", "favicon.svg", "preview", "_astro"].filter((name) =>
        isDocPage(name),
      ),
    ).toEqual(["index.html", "components.html"]);
  });
});

describe("assertIndexCoversPages", () => {
  it("passes when the counts match", () => {
    expect(() => assertIndexCoversPages({ indexed: 8, pages: 8 })).not.toThrow();
  });

  it("fails when a page dropped out of the index", () => {
    expect(() => assertIndexCoversPages({ indexed: 7, pages: 8 })).toThrow(
      "7 pages indexed, 8 doc pages built",
    );
  });

  it("fails when the previews leaked into the index", () => {
    expect(() => assertIndexCoversPages({ indexed: 19, pages: 8 })).toThrow(/19 pages indexed/u);
  });

  it("fails when nothing was built", () => {
    expect(() => assertIndexCoversPages({ indexed: 0, pages: 0 })).toThrow("no doc pages");
  });
});
