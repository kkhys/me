import type { Root } from "mdast";
import { SKIP, visit } from "unist-util-visit";

// Unwrap images that are the sole child of a paragraph node.
// Prevents invalid <p><figure>...</figure></p> HTML when Astro
// transforms images with titles into <figure> elements.
const remarkUnwrapImages = () => (tree: Root) => {
  visit(tree, "paragraph", (node, index, parent) => {
    const child = node.children[0];
    if (
      !parent ||
      typeof index !== "number" ||
      node.children.length !== 1 ||
      !child ||
      child.type !== "image"
    ) {
      return;
    }

    parent.children.splice(index, 1, child);
    return [SKIP, index];
  });
};

export default remarkUnwrapImages;
