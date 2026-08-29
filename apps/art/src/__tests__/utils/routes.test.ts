import { describe, expect, it } from "vitest";
import { fashionPath, fashionTransitionName, workPath, workTransitionName } from "#/utils/routes";

describe("paths", () => {
  it("builds detail page paths", () => {
    expect(workPath("landscape-2")).toBe("/works/landscape-2");
    expect(fashionPath("series-1", 3)).toBe("/fashion/series-1/03");
  });
});

describe("transition names", () => {
  it("prefixes slugs so the names stay valid CSS identifiers", () => {
    expect(workTransitionName("2001")).toBe("work-2001");
    expect(fashionTransitionName("series-1", 3)).toBe("fashion-series-1-03");
  });

  it("keeps works and fashion sheets from colliding", () => {
    expect(workTransitionName("series-1-03")).not.toBe(fashionTransitionName("series-1", 3));
  });
});
