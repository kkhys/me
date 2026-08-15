export interface TokenDeclaration {
  name: string;
  value: string;
}

/** Parses `--name: value;` declarations out of a stylesheet, in order. */
export const parseCustomProperties = (css: string): TokenDeclaration[] => {
  const declarations: TokenDeclaration[] = [];
  for (const match of css.matchAll(/(--[\w-]+):\s*([^;]+);/gu)) {
    const [, name, value] = match;
    if (name === undefined || value === undefined) continue;
    declarations.push({ name, value: value.replaceAll(/\s+/gu, " ").trim() });
  }
  return declarations;
};

/**
 * Splits a `light-dark(a, b)` value at its top-level comma. Returns null for
 * anything else, including nested light-dark() inside a larger expression.
 */
export const splitLightDark = (value: string): { light: string; dark: string } | null => {
  const match = value.match(/^light-dark\((?<inner>.*)\)$/u);
  const inner = match?.groups?.["inner"];
  if (inner === undefined) return null;
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    const character = inner[i];
    if (character === "(") depth++;
    else if (character === ")") depth--;
    else if (character === "," && depth === 0) {
      return { light: inner.slice(0, i).trim(), dark: inner.slice(i + 1).trim() };
    }
  }
  return null;
};

export const filterByPrefix = (
  declarations: TokenDeclaration[],
  prefix: string,
): TokenDeclaration[] => declarations.filter(({ name }) => name.startsWith(prefix));
