export type SourceRefPart =
  | { kind: "text"; text: string }
  | { kind: "ref"; path: string; line: number };

/* Repo-relative `path:line` references as they appear in prose, e.g.
   `apps/memo/src/components/avatar.astro:44`. Astro dynamic-route names may
   contain brackets and dots. */
const SOURCE_REF = /(?<path>(?:apps|packages)\/[\w./[\]-]+?):(?<line>\d+)/gu;

/** Splits prose into plain text and linkable `path:line` references. */
export const splitSourceRefs = (text: string): SourceRefPart[] => {
  const parts: SourceRefPart[] = [];
  let cursor = 0;
  for (const match of text.matchAll(SOURCE_REF)) {
    const path = match.groups?.["path"];
    const line = match.groups?.["line"];
    if (path === undefined || line === undefined || match.index === undefined) continue;
    if (match.index > cursor) parts.push({ kind: "text", text: text.slice(cursor, match.index) });
    parts.push({ kind: "ref", path, line: Number(line) });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) parts.push({ kind: "text", text: text.slice(cursor) });
  return parts;
};
