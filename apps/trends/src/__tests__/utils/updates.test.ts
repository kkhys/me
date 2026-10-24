import { describe, expect, it } from "vitest";

import { formatUpdateDate, splitProducts } from "#/utils/updates";

const product = (label: string, status: "ok" | "error" | "skipped", items: number) => ({
  label,
  status,
  items: Array.from({ length: items }, (_, i) => ({ url: `https://${label}/${i}` })),
});

describe("splitProducts", () => {
  it("renders products with rows as cards", () => {
    const { active, quiet } = splitProducts([product("Claude", "ok", 2)]);

    expect(active.map((p) => p.label)).toEqual(["Claude"]);
    expect(quiet).toEqual([]);
  });

  it("collects quiet products by label, in order", () => {
    const { active, quiet } = splitProducts([
      product("Claude", "ok", 1),
      product("Devin", "ok", 0),
      product("Slack", "ok", 0),
    ]);

    expect(active.map((p) => p.label)).toEqual(["Claude"]);
    expect(quiet).toEqual(["Devin", "Slack"]);
  });

  it("keeps a failed product visible even without rows", () => {
    const { active, quiet } = splitProducts([product("Orca", "error", 0)]);

    expect(active.map((p) => p.label)).toEqual(["Orca"]);
    expect(quiet).toEqual([]);
  });

  it("handles an empty list", () => {
    expect(splitProducts([])).toEqual({ active: [], quiet: [] });
  });
});

describe("formatUpdateDate", () => {
  it("formats the JST day with dots", () => {
    expect(formatUpdateDate("2026-10-23T05:00:00+00:00")).toBe("2026.10.23");
  });

  it("rolls a late UTC timestamp over to the next JST day", () => {
    expect(formatUpdateDate("2026-10-23T23:39:00+00:00")).toBe("2026.10.24");
  });

  it("returns an empty string for month-dated entries", () => {
    expect(formatUpdateDate("")).toBe("");
  });

  it("returns an empty string for garbage", () => {
    expect(formatUpdateDate("not a date")).toBe("");
  });
});
