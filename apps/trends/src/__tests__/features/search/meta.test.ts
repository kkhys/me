import { describe, expect, it } from "vitest";

import { buildDateMeta, buildDateSort } from "#/features/search/utils/meta";

describe("buildDateMeta", () => {
  it("inlines the run date under the date meta key", () => {
    expect(buildDateMeta("2026-08-10")).toBe("date:2026-08-10");
  });
});

describe("buildDateSort", () => {
  it("inlines the run date under the sort key", () => {
    expect(buildDateSort("2026-08-10")).toBe("date:2026-08-10");
  });
});
