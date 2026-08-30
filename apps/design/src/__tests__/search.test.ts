import type { PagefindSearchFragment, PagefindSubResult } from "@kkhys/search/types";
import { describe, expect, it } from "vitest";
import { pickSubResult, toSectionHref } from "#/utils/search";

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

describe("toSectionHref", () => {
  it("drops .html and keeps the heading fragment", () => {
    expect(toSectionHref("/components.html#search-dialog")).toBe("/components#search-dialog");
  });

  it("handles the page itself", () => {
    expect(toSectionHref("/components.html")).toBe("/components");
    expect(toSectionHref("/index.html")).toBe("/");
  });
});
