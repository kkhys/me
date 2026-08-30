export interface SvgAttributes {
  viewBox: string | null;
  strokeWidth: string | null;
  stroke: string | null;
  fill: string | null;
}

/** Reads the presentation attributes off the root `<svg>` tag. */
export const parseSvgAttributes = (svg: string): SvgAttributes => {
  const root = svg.match(/<svg\b(?<attrs>[^>]*)>/u)?.groups?.["attrs"] ?? "";
  const read = (name: string): string | null =>
    root.match(new RegExp(`(?:^|\\s)${name}="(?<value>[^"]*)"`, "u"))?.groups?.["value"] ?? null;
  return {
    viewBox: read("viewBox"),
    strokeWidth: read("stroke-width"),
    stroke: read("stroke"),
    fill: read("fill"),
  };
};

/** `…/icons/move-up-right.svg` → `move-up-right`. */
export const iconNameFromPath = (path: string): string =>
  path.replace(/^.*\//u, "").replace(/\.svg$/u, "");

/** `move-up-right` → `MoveUpRightIcon`, the import name the apps use. */
export const iconImportName = (name: string): string =>
  `${name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}Icon`;
