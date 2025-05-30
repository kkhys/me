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

const toCodePoint = (unicodeSurrogates: string) => {
  const r = [];
  let c = 0;
  let i = 0;
  let p = 0;

  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((65536 + ((p - 55296) << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join("-");
};

export const getIconCode = (char: string) => {
  const U200D = String.fromCharCode(8205);
  const UFE0Fg = /\uFE0F/g;
  return toCodePoint(!char.includes(U200D) ? char.replace(UFE0Fg, "") : char);
};

const emojiCache: Record<string, Promise<string>> = {};

export const loadEmoji = async (type: keyof typeof apis, code: string) => {
  const key = `${type}:${code}`;

  if (key in emojiCache) {
    return emojiCache[key];
  }

  const resolvedType = type && apis[type] ? type : "twemoji";

  const api = apis[resolvedType];

  if (typeof api === "function") {
    const result = fetch(api(code)).then(async (r) => r.text());
    emojiCache[key] = result;
    return result;
  }

  const result = fetch(`${api}${code.toUpperCase()}.svg`).then(async (r) =>
    r.text(),
  );
  emojiCache[key] = result;
  return result;
};
