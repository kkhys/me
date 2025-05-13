import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { generateBech32m } from "../lib/hash";

const rehypeSlugWithCustomId = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (node.tagName && /^h[1-6]$/.test(node.tagName)) {
      const originalText = node.children
        .filter((child) => child.type === "text")
        .map((child) => child.value)
        .join("");

      const customId = generateBech32m(originalText, "h");

      node.properties = node.properties || {};
      node.properties.id = customId;
    }
  });
};

export default rehypeSlugWithCustomId;
