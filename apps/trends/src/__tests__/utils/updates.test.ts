import { describe, expect, it } from "vitest";

import { splitProducts } from "#/utils/updates";

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
