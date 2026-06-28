import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Element, ElementContent, Root } from "hast";
import svgToMiniDataURI from "mini-svg-data-uri";
import { visit } from "unist-util-visit";

// Resolve relative to this file so cached SVGs are found regardless of the
// working directory Astro runs the build from (cache lives at apps/me/.cache).
const CACHE_DIR = join(import.meta.dirname, "..", "..", ".cache", "mermaid");

const getMermaidHash = (source: string) =>
  createHash("sha256").update(source).digest("hex").slice(0, 16);

const extractDimensions = (svg: string): { width: string; height: string } | undefined => {
  const widthMatch = svg.match(/width="([^"]+)"/);
  const heightMatch = svg.match(/height="([^"]+)"/);
  if (!widthMatch?.[1] || !heightMatch?.[1]) return undefined;
  return {
    width: widthMatch[1],
    height: heightMatch[1],
  };
};

const rehypeMermaidCached = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre" || index === undefined || !parent || !("children" in parent)) {
        return;
      }

      const codeEl = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "code",
      );

      if (!codeEl) return;

      const classNames = codeEl.properties?.className;
      if (!Array.isArray(classNames) || !classNames.includes("language-mermaid")) {
        return;
      }

      const source = codeEl.children
        .filter((c): c is { type: "text"; value: string } => c.type === "text")
        .map((c) => c.value)
        .join("");

      const trimmedSource = source.trim();
      if (!trimmedSource) return;

      const hash = getMermaidHash(trimmedSource);
      const lightPath = `${CACHE_DIR}/${hash}-light.svg`;
      const darkPath = `${CACHE_DIR}/${hash}-dark.svg`;

      let lightSvg: string;
      let darkSvg: string;

      try {
        lightSvg = readFileSync(lightPath, "utf-8");
        darkSvg = readFileSync(darkPath, "utf-8");
      } catch {
        throw new Error(
          `Mermaid cache not found for hash ${hash}. Run "pnpm render:mermaid" to generate cached SVGs.`,
        );
      }

      const lightDims = extractDimensions(lightSvg);
      const darkDims = extractDimensions(darkSvg);

      const lightDataUri = svgToMiniDataURI(lightSvg);
      const darkSrcset = svgToMiniDataURI.toSrcset(darkSvg);

      const sourceEl: Element = {
        type: "element",
        tagName: "source",
        properties: {
          media: "(prefers-color-scheme: dark)",
          srcSet: darkSrcset,
          ...(darkDims && {
            width: darkDims.width,
            height: darkDims.height,
          }),
        },
        children: [],
      };

      const imgEl: Element = {
        type: "element",
        tagName: "img",
        properties: {
          alt: "",
          src: lightDataUri,
          ...(lightDims && {
            width: lightDims.width,
            height: lightDims.height,
          }),
        },
        children: [],
      };

      const pictureEl: Element = {
        type: "element",
        tagName: "picture",
        properties: {},
        children: [sourceEl, imgEl],
      };

      (parent.children as ElementContent[])[index] = pictureEl;
    });
  };
};

export default rehypeMermaidCached;
