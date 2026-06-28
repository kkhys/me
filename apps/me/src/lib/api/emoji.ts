const apis = {
  twemoji: (code: string) =>
    `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code.toLowerCase()}.svg`,
  openmoji: "https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@2.0.0/svg/",
  blobmoji: "https://cdn.jsdelivr.net/npm/@svgmoji/blob@2.0.0/svg/",
  noto: "https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/",
  fluent: (code: string) =>
    `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_color.svg`,
  fluentFlat: (code: string) =>
    `https://cdn.jsdelivr.net/gh/shuding/fluentui-emoji-unicode/assets/${code.toLowerCase()}_flat.svg`,
};

// Iterating a string with for...of yields whole code points, so surrogate
// pairs (e.g. emoji above U+FFFF) stay intact without manual UTF-16 bookkeeping.
const toCodePoint = (unicodeSurrogates: string) => {
  const codePoints: string[] = [];
  for (const char of unicodeSurrogates) {
    const code = char.codePointAt(0);
    if (code !== undefined) codePoints.push(code.toString(16));
  }
  return codePoints.join("-");
};

export const getIconCode = (char: string) => {
  const U200D = "\u200D";
  const UFE0Fg = /\uFE0F/gu;
  return toCodePoint(char.includes(U200D) ? char : char.replace(UFE0Fg, ""));
};

// Return the first grapheme cluster, not the first code point. Flags (Regional
// Indicator pairs) and ZWJ sequences span multiple code points, so naive
// indexing would split them and yield a broken fragment.
export const getFirstGrapheme = (value: string) => {
  const segmenter = new Intl.Segmenter();
  const [first] = segmenter.segment(value);
  return first?.segment ?? value;
};

import { createCache } from "#/lib/api/cache";

const cache = createCache<string | undefined>();

export const loadEmoji = (type: keyof typeof apis, code: string) => {
  const key = `${type}:${code}`;

  return cache(key, async () => {
    const resolvedType = type && apis[type] ? type : "twemoji";
    const api = apis[resolvedType];
    const url = typeof api === "function" ? api(code) : `${api}${code.toUpperCase()}.svg`;

    const r = await fetch(url);
    // A set may not provide every emoji (e.g. fluent omits country flags).
    // Return undefined so callers can fall back to another set.
    if (!r.ok) return;
    return r.text();
  });
};
