import { describe, expect, it } from "vitest";
import { figureAlt } from "#/utils/image-alt";

describe("figureAlt", () => {
  it("empties the alt when the caption repeats it", () => {
    expect(figureAlt("Mission Controlの一例", "Mission Controlの一例")).toBe("");
  });

  it("ignores surrounding whitespace when comparing", () => {
    expect(figureAlt(" 図 ", "図")).toBe("");
  });

  it("keeps an alt that differs from the caption", () => {
    expect(figureAlt("Finderの設定", "サイドバーも整理している")).toBe("Finderの設定");
  });

  it("keeps the alt when there is no caption", () => {
    expect(figureAlt("Finderの設定", undefined)).toBe("Finderの設定");
  });

  it("passes an already empty alt through", () => {
    expect(figureAlt("", "キャプション")).toBe("");
  });
});
