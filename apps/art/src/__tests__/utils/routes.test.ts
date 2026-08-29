import { describe, expect, it } from "vitest";
import {
  fashionPath,
  fashionTransitionName,
  padNumber,
  workPath,
  workTransitionName,
} from "#/utils/routes";

describe("padNumber", () => {
  it("pads to two digits like the NN.jpg file names", () => {
    expect(padNumber(1)).toBe("01");
    expect(padNumber(10)).toBe("10");
    expect(padNumber(123)).toBe("123");
  });
});

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
