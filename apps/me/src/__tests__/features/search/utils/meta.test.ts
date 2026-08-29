import { describe, expect, it } from "vitest";
import { searchConfig } from "#/features/search/config";
import {
  buildBodyMeta,
  buildCategoryFilter,
  buildDateMeta,
  buildTitleMeta,
} from "#/features/search/utils/meta";
import { buildSearchOptions } from "#/features/search/utils/query";

describe("buildTitleMeta", () => {
  it("puts the inline emoji capture last so it can hold any character", () => {
    expect(buildTitleMeta("🧑‍💻")).toBe("title, emoji:🧑‍💻");
    expect(buildTitleMeta("a,b")).toMatch(/emoji:a,b$/u);
  });
});

describe("buildDateMeta", () => {
  it("captures the visible date and the machine-readable datetime attribute", () => {
    expect(buildDateMeta()).toBe("date, datetime[datetime]");
  });
});

describe("buildBodyMeta", () => {
  it("blanks the automatic image capture", () => {
    expect(buildBodyMeta()).toBe("image:");
  });
});

describe("buildCategoryFilter", () => {
  it("uses the same filter key the search options send", () => {
    expect(buildCategoryFilter("Tech")).toBe(`${searchConfig.filterKey}:Tech`);
    expect(buildSearchOptions("Tech")).toEqual({
      filters: { [searchConfig.filterKey]: "Tech" },
    });
  });
});
