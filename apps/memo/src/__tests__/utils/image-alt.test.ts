import { describe, expect, it } from "vitest";
import { memoImageAlt } from "#/utils/image-alt";

describe("memoImageAlt", () => {
  const alts = [
    { file: "01.jpg", alt: "干し芋の袋" },
    { file: "02.png", alt: "" },
  ];

  it("returns the alt recorded for the file", () => {
    expect(memoImageAlt("01.jpg", 0, alts)).toBe("干し芋の袋");
  });

  it("keeps an explicitly empty alt", () => {
    expect(memoImageAlt("02.png", 1, alts)).toBe("");
  });

  it("falls back to a numbered label for a file without an entry", () => {
    expect(memoImageAlt("03.jpg", 2, alts)).toBe("Image 3");
  });

  it("falls back when the memo has no images frontmatter", () => {
    expect(memoImageAlt("01.jpg", 0, undefined)).toBe("Image 1");
  });
});
