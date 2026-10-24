import type { PagefindSubResult } from "@kkhys/search/types";
import { describe, expect, it } from "vitest";

import { isItemSection } from "#/features/search/utils/section";

const section = (anchor?: { element: string; id: string }): PagefindSubResult => ({
  title: "",
  url: "/2026-08-10.html",
  excerpt: "",
  weighted_locations: [],
  ...(anchor === undefined ? {} : { anchor: { ...anchor, location: 0 } }),
});

describe("isItemSection", () => {
  it("is true for the h4 row titles", () => {
    expect(isItemSection(section({ element: "h4", id: "global-hackernews-1" }))).toBe(true);
    expect(isItemSection(section({ element: "H4", id: "updates-claude-1" }))).toBe(true);
  });

  it("is false for the page itself and the group / source headings", () => {
    expect(isItemSection(section())).toBe(false);
    expect(isItemSection(section({ element: "h2", id: "global" }))).toBe(false);
    expect(isItemSection(section({ element: "h3", id: "global-hackernews" }))).toBe(false);
  });
});
