import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { isVideo } from "./mdast-util-node-is";

const remarkVideoBlock = () => (tree: Root) => {
  visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
    if (!parent || typeof index !== "number" || !isVideo(node)) {
      return;
    }

    parent.children[index] = {
      type: "mdxJsxFlowElement",
      name: "video-block",
      attributes: node.attributes || [],
      children: [],
    };
  });
};

export default remarkVideoBlock;
