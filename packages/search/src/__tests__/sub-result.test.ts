import { describe, expect, it } from "vitest";
import { pickSubResult } from "../sub-result";
import type { PagefindSearchFragment, PagefindSubResult } from "../types";

const subResult = (title: string, weights: number[], anchor?: string): PagefindSubResult => ({
  title,
  url: anchor === undefined ? "/components.html" : `/components.html#${anchor}`,
  excerpt: "",
  weighted_locations: weights.map((weight, location) => ({
    weight,
    balanced_score: weight,
    location,
  })),
  ...(anchor === undefined ? {} : { anchor: { element: "h2", id: anchor, location: 0 } }),
});

const fragment = (sub_results: PagefindSubResult[]): PagefindSearchFragment => ({
  url: "/components.html",
  raw_url: "/components.html",
  content: "",
  excerpt: "",
  word_count: 0,
  meta: { title: "Components" },
  filters: {},
  sub_results,
});

describe("pickSubResult", () => {
  it("picks the section with the heaviest matches, not the first", () => {
    const picked = pickSubResult(
      fragment([
        subResult("Components", [1]),
        subResult("Button", [1, 1], "button"),
        subResult("SearchDialog", [10], "search-dialog"),
      ]),
    );
    expect(picked?.title).toBe("SearchDialog");
  });

  it("keeps the earlier section on a tie", () => {
    const picked = pickSubResult(
      fragment([subResult("Button", [2], "button"), subResult("Spinner", [2], "spinner")]),
    );
    expect(picked?.title).toBe("Button");
  });

  it("is undefined without sections", () => {
    expect(pickSubResult(fragment([]))).toBeUndefined();
  });
});

const isRow = (section: PagefindSubResult) => section.anchor?.element === "h4";
const row = (title: string, weights: number[], anchor: string): PagefindSubResult => ({
  ...subResult(title, weights, anchor),
  anchor: { element: "h4", id: anchor, location: 0 },
});

describe("pickSubResult with a preference", () => {
  it("picks among the preferred sections when any of them matched", () => {
    const picked = pickSubResult(
      fragment([
        subResult("Headline", [7, 7]),
        row("Kimi K3", [4], "global-hackernews-1"),
        row("Kimi K3 Technical Report", [4, 4], "global-hackernews-2"),
      ]),
      isRow,
    );
    expect(picked?.title).toBe("Kimi K3 Technical Report");
  });

  it("falls back to every section when no preferred one matched", () => {
    const picked = pickSubResult(
      fragment([subResult("Headline", [7]), subResult("Hacker News", [5], "global-hackernews")]),
      isRow,
    );
    expect(picked?.title).toBe("Headline");
  });
});
