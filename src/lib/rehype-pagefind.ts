import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

const shouldNotIndexed = (node: Element) =>
  node.tagName === "a" && Object.hasOwn(node.properties, "dataLinkCard");

const rehypePagefind = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (shouldNotIndexed(node)) {
      node.properties = {
        ...node.properties,
        dataPagefindIgnore: true,
      };
    }
  });
};

export default rehypePagefind;
