import { describe, expect, it } from "vitest";
import {
  composite,
  contrastRatio,
  gradeContrast,
  oklchToRgb,
  parseOklch,
  relativeLuminance,
  resolveColor,
  toColorVars,
  toHex,
} from "#/utils/color";
import { parseCustomProperties } from "#/utils/tokens";

const BLACK = { r: 0, g: 0, b: 0 };
const WHITE = { r: 1, g: 1, b: 1 };

describe("parseOklch", () => {
  it("parses percent lightness and a bare hue", () => {
    expect(parseOklch("oklch(14.38% 0.007 256.88)")).toEqual({
      l: 0.1438,
      c: 0.007,
      h: 256.88,
      alpha: 1,
    });
  });

  it("accepts 0–1 lightness, deg hues and both alpha notations", () => {
    expect(parseOklch("oklch(0.5 0.1 90deg / 10%)")).toEqual({ l: 0.5, c: 0.1, h: 90, alpha: 0.1 });
    expect(parseOklch("oklch(50% 0.1 90 / 0.25)")).toEqual({ l: 0.5, c: 0.1, h: 90, alpha: 0.25 });
  });

  it("rejects anything that is not an absolute oklch()", () => {
    expect(parseOklch("var(--uchu-yin)")).toBeNull();
    expect(parseOklch("oklch(from var(--c-ring) l c h / 55%)")).toBeNull();
    expect(parseOklch("#0e1117")).toBeNull();
  });
});

describe("oklchToRgb", () => {
  it("converts the uchu anchors and a mid grey", () => {
    // uchu yang; the Satori mirror rounds it to #fcfcfc.
    expect(toHex(oklchToRgb({ l: 0.994, c: 0, h: 0, alpha: 1 }))).toBe("#fdfdfd");
    // OKLab L 0.5 is linear 0.125 on every channel, i.e. sRGB 99.
    expect(toHex(oklchToRgb({ l: 0.5, c: 0, h: 0, alpha: 1 }))).toBe("#636363");
    // uchu yin. Note the Satori mirror (#0e1117) is lighter than the OKLCH
    // value resolves to; this is the color the browser actually paints.
    expect(toHex(oklchToRgb({ l: 0.1438, c: 0.007, h: 256.88, alpha: 1 }))).toBe("#080a0d");
  });

  it("maps the OKLCH extremes to black and white", () => {
    expect(toHex(oklchToRgb({ l: 0, c: 0, h: 0, alpha: 1 }))).toBe("#000000");
    expect(toHex(oklchToRgb({ l: 1, c: 0, h: 0, alpha: 1 }))).toBe("#ffffff");
  });
});

describe("contrastRatio", () => {
  it("is 21:1 for black on white and 1:1 for a color on itself", () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, WHITE)).toBe(1);
  });

  it("uses the WCAG luminance weights", () => {
    expect(relativeLuminance({ r: 0, g: 1, b: 0 })).toBeCloseTo(0.7152, 5);
  });
});

describe("composite", () => {
  it("blends in gamma space", () => {
    expect(composite(WHITE, 0.5, BLACK)).toEqual({ r: 0.5, g: 0.5, b: 0.5 });
    expect(composite(WHITE, 1, BLACK)).toEqual(WHITE);
    expect(composite(WHITE, 0, BLACK)).toEqual(BLACK);
  });
});

describe("gradeContrast", () => {
  it("applies the text thresholds", () => {
    expect(gradeContrast(7, "text")).toBe("AAA");
    expect(gradeContrast(4.5, "text")).toBe("AA");
    expect(gradeContrast(3, "text")).toBe("AA-large");
    expect(gradeContrast(2.9, "text")).toBe("fail");
  });

  it("applies the 3:1 non-text threshold", () => {
    expect(gradeContrast(3, "ui")).toBe("AA");
    expect(gradeContrast(2.99, "ui")).toBe("fail");
    expect(gradeContrast(21, "ui")).toBe("AA");
  });

  it("never grades decorative pairs", () => {
    expect(gradeContrast(1.1, "decorative")).toBe("exempt");
    expect(gradeContrast(21, "decorative")).toBe("exempt");
  });
});

describe("resolveColor", () => {
  const vars = toColorVars(
    parseCustomProperties(`
      --uchu-yin-raw: 14.38% 0.007 256.88;
      --uchu-yin: oklch(var(--uchu-yin-raw));
      --uchu-yang-raw: 99.4% 0 0;
      --uchu-yang: oklch(var(--uchu-yang-raw));
      --c-bg: light-dark(var(--uchu-yang), var(--uchu-yin));
      --c-ring: light-dark(var(--uchu-yin), var(--uchu-yang));
      --ring: oklch(from var(--c-ring) l c h / 55%);
      --loop-a: var(--loop-b);
      --loop-b: var(--loop-a);
    `),
  );

  it("follows var() chains and picks the light-dark() side for the scheme", () => {
    expect(resolveColor("var(--c-bg)", vars, "light")).toEqual({ l: 0.994, c: 0, h: 0, alpha: 1 });
    expect(resolveColor("var(--c-bg)", vars, "dark")).toEqual({
      l: 0.1438,
      c: 0.007,
      h: 256.88,
      alpha: 1,
    });
  });

  it("substitutes raw triplets and reads the alpha", () => {
    expect(resolveColor("oklch(var(--uchu-yang-raw) / 10%)", vars, "light")).toEqual({
      l: 0.994,
      c: 0,
      h: 0,
      alpha: 0.1,
    });
  });

  it("applies the alpha of a relative oklch(from …) form to the resolved origin", () => {
    expect(resolveColor("var(--ring)", vars, "light")).toEqual({
      l: 0.1438,
      c: 0.007,
      h: 256.88,
      alpha: 0.55,
    });
    expect(resolveColor("var(--ring)", vars, "dark")).toEqual({
      l: 0.994,
      c: 0,
      h: 0,
      alpha: 0.55,
    });
    expect(resolveColor("oklch(from oklch(50% 0 0) l c h / 0.5)", vars, "light")).toEqual({
      l: 0.5,
      c: 0,
      h: 0,
      alpha: 0.5,
    });
  });

  it("returns null for unknown names, foreign syntaxes and reference cycles", () => {
    expect(resolveColor("var(--nope)", vars, "light")).toBeNull();
    expect(resolveColor("#0e1117", vars, "light")).toBeNull();
    expect(resolveColor("var(--loop-a)", vars, "light")).toBeNull();
  });
});
