import { splitLightDark, type TokenDeclaration } from "#/utils/tokens";

/* Just enough color math to grade the palette against WCAG 2.x: uchu is
   authored in OKLCH, so every token is converted OKLCH → OKLab → linear
   sRGB and then to the gamma-encoded sRGB the browser paints. No gamut
   mapping beyond clamping; the palette is well inside sRGB. */

export interface Oklch {
  /** Lightness, 0–1. */
  l: number;
  /** Chroma. */
  c: number;
  /** Hue in degrees. */
  h: number;
  /** 0–1. */
  alpha: number;
}

/** Gamma-encoded sRGB, each channel 0–1. */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const NUMBER = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?`;
const OKLCH = new RegExp(
  String.raw`^oklch\(\s*(?<l>${NUMBER})(?<lUnit>%)?\s+(?<c>${NUMBER})\s+(?<h>${NUMBER})(?:deg)?\s*(?:/\s*(?<a>${NUMBER})(?<aUnit>%)?\s*)?\)$`,
  "iu",
);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/* `99.4% / 100` is 0.9940000000000001 in binary; round the division so
   parsed tokens compare cleanly. */
const fraction = (value: string, isPercent: boolean) =>
  isPercent ? Math.round(Number(value) * 1e8) / 1e10 : Number(value);

/** Parses an absolute `oklch(L C H [/ A])`; L and A accept `%` or 0–1. */
export const parseOklch = (value: string): Oklch | null => {
  const groups = value.trim().match(OKLCH)?.groups;
  if (groups?.["l"] === undefined || groups["c"] === undefined || groups["h"] === undefined) {
    return null;
  }
  const l = fraction(groups["l"], groups["lUnit"] === "%");
  const alpha = groups["a"] === undefined ? 1 : fraction(groups["a"], groups["aUnit"] === "%");
  return { l: clamp01(l), c: Number(groups["c"]), h: Number(groups["h"]), alpha: clamp01(alpha) };
};

const linearToGamma = (channel: number) =>
  channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;

const gammaToLinear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** OKLCH → gamma-encoded sRGB, channels clamped to the sRGB gamut. */
export const oklchToRgb = ({ l, c, h }: Oklch): Rgb => {
  const radians = (h * Math.PI) / 180;
  const a = c * Math.cos(radians);
  const b = c * Math.sin(radians);

  const lms = {
    l: (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m: (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s: (l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  };

  const linear = {
    r: 4.0767416621 * lms.l - 3.3077115913 * lms.m + 0.2309699292 * lms.s,
    g: -1.2684380046 * lms.l + 2.6097574011 * lms.m - 0.3413193965 * lms.s,
    b: -0.0041960863 * lms.l - 0.7034186147 * lms.m + 1.707614701 * lms.s,
  };
  return {
    r: linearToGamma(clamp01(linear.r)),
    g: linearToGamma(clamp01(linear.g)),
    b: linearToGamma(clamp01(linear.b)),
  };
};

export const toHex = ({ r, g, b }: Rgb): string =>
  `#${[r, g, b]
    .map((channel) =>
      Math.round(channel * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

/** Source-over compositing in gamma space, as the browser paints it. */
export const composite = (fg: Rgb, alpha: number, bg: Rgb): Rgb => ({
  r: fg.r * alpha + bg.r * (1 - alpha),
  g: fg.g * alpha + bg.g * (1 - alpha),
  b: fg.b * alpha + bg.b * (1 - alpha),
});

/** WCAG 2.x relative luminance of a gamma-encoded sRGB color. */
export const relativeLuminance = ({ r, g, b }: Rgb): number =>
  0.2126 * gammaToLinear(r) + 0.7152 * gammaToLinear(g) + 0.0722 * gammaToLinear(b);

/** WCAG 2.x contrast ratio, 1–21, between two opaque colors. */
export const contrastRatio = (a: Rgb, b: Rgb): number => {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/**
 * What the pair paints. `decorative` covers dividers and surfaces that
 * carry no information on their own (layout and spacing do the work), which
 * WCAG 1.4.11 leaves out of the 3:1 requirement.
 */
export type ContrastUse = "text" | "ui" | "decorative";

export type ContrastGrade = "AAA" | "AA" | "AA-large" | "fail" | "exempt";

/**
 * Grades a ratio the way WCAG 2.2 does: text needs 4.5:1 (AA) or 7:1
 * (AAA), with 3:1 accepted for large text only; non-text UI parts (focus
 * indicators, control boundaries) need 3:1. Decorative pairs are reported
 * but never graded.
 */
export const gradeContrast = (ratio: number, use: ContrastUse): ContrastGrade => {
  if (use === "decorative") return "exempt";
  if (use === "ui") return ratio >= 3 ? "AA" : "fail";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "fail";
};

export type ColorVars = ReadonlyMap<string, string>;

export const toColorVars = (declarations: readonly TokenDeclaration[]): ColorVars =>
  new Map(declarations.map(({ name, value }) => [name, value]));

const VAR = /var\((?<name>--[\w-]+)\)/gu;
const RELATIVE_OKLCH = new RegExp(
  String.raw`^oklch\(\s*from\s+(?<origin>.+?)\s+l\s+c\s+h\s*(?:/\s*(?<a>${NUMBER})(?<aUnit>%)?\s*)?\)$`,
  "iu",
);

/* Splits `oklch(from <origin> l c h / A)` where <origin> may itself contain
   parentheses; the regex above is only safe once we know the origin's
   extent, so walk the parens first. */
const relativeOrigin = (value: string): { origin: string; rest: string } | null => {
  const prefix = value.match(/^oklch\(\s*from\s+/iu);
  if (!prefix) return null;
  let depth = 0;
  for (let i = prefix[0].length; i < value.length; i++) {
    const character = value[i];
    if (character === "(") depth++;
    else if (character === ")") depth--;
    else if (/\s/u.test(character ?? "") && depth === 0) {
      return { origin: value.slice(prefix[0].length, i), rest: value.slice(i) };
    }
  }
  return null;
};

export type Scheme = "light" | "dark";

/**
 * Resolves a token value to the absolute OKLCH color it paints under
 * `scheme`. Handles `var()` chains, `light-dark()` at any depth, raw
 * triplets inside `oklch(var(--x-raw) / 10%)`, and the
 * `oklch(from <color> l c h / A)` alpha form the tokens use. Anything else
 * (unknown names, other color syntaxes, reference cycles) returns null.
 */
export const resolveColor = (
  value: string,
  vars: ColorVars,
  scheme: Scheme,
  depth = 0,
): Oklch | null => {
  if (depth > 16) return null;
  const trimmed = value.trim();

  const pair = splitLightDark(trimmed);
  if (pair) return resolveColor(pair[scheme], vars, scheme, depth + 1);

  const single = trimmed.match(/^var\((?<name>--[\w-]+)\)$/u)?.groups?.["name"];
  if (single !== undefined) {
    const next = vars.get(single);
    return next === undefined ? null : resolveColor(next, vars, scheme, depth + 1);
  }

  const relative = relativeOrigin(trimmed);
  if (relative) {
    const origin = resolveColor(relative.origin, vars, scheme, depth + 1);
    const tail = `oklch(from x${relative.rest}`.match(RELATIVE_OKLCH)?.groups;
    if (!origin || !tail) return null;
    const alpha =
      tail["a"] === undefined ? origin.alpha : fraction(tail["a"], tail["aUnit"] === "%");
    return { ...origin, alpha: clamp01(alpha) };
  }

  const substituted = trimmed.replaceAll(VAR, (match, name: string) => vars.get(name) ?? match);
  return parseOklch(substituted);
};
