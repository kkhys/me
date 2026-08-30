import { describe, expect, it } from "vitest";
import { buildSearchOptions } from "#/features/search/utils/query";

describe("buildSearchOptions", () => {
  it("returns no filters when no category is selected", () => {
    expect(buildSearchOptions(undefined)).toEqual({});
    expect(buildSearchOptions("")).toEqual({});
  });

  it("filters by the selected category", () => {
    expect(buildSearchOptions("Tech")).toEqual({ filters: { category: "Tech" } });
  });
});
