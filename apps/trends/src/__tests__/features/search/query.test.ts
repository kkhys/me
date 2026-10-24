import { describe, expect, it } from "vitest";

import { buildSearchOptions, parseSortMode } from "#/features/search/utils/query";

describe("parseSortMode", () => {
  it("accepts the date ordering", () => {
    expect(parseSortMode("date")).toBe("date");
  });

  it("falls back to relevance for anything else", () => {
    expect(parseSortMode(null)).toBe("relevance");
    expect(parseSortMode(undefined)).toBe("relevance");
    expect(parseSortMode("relevance")).toBe("relevance");
    expect(parseSortMode("oldest")).toBe("relevance");
  });
});

describe("buildSearchOptions", () => {
  it("sorts by the run date, newest first, in date mode", () => {
    expect(buildSearchOptions("date")).toEqual({ sort: { date: "desc" } });
  });

  it("leaves Pagefind's relevance order alone otherwise", () => {
    expect(buildSearchOptions("relevance")).toEqual({});
  });
});
