import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import { hasChildren, isVideo } from "./mdast-util-node-is";

const remarkVideoBlock = () => (tree: Root) => {
  visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
    if (!parent || typeof index !== "number" || !isVideo(node)) {
      return;
    }

    if (hasChildren(node)) {
      throw new Error("video-block は子要素を持つことができません。");
    }

    parent.children[index] = {
      type: "mdxJsxFlowElement",
      name: "video-block",
      attributes: node.attributes || [],
      children: [], // 意図的に空 - video-blockは自己完結型
    };
  });
};

export default remarkVideoBlock;
