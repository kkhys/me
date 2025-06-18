import type { Element, ElementContent, Root } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { SKIP, visit } from "unist-util-visit";
import { budouxProcess } from "./budoux";

const defaultTargetTagNames = ["p", "li", "h1", "h2", "h3"];

const isElement = (node: Element | ElementContent): node is Element =>
  node.type === "element";

const isTargetNode = (
  node: Element | ElementContent,
  targetTagNames: string[],
): node is Element =>
  isElement(node) ? targetTagNames.includes(node.tagName) : false;

const rehypeBudoux =
  ({
    targetTagNames = defaultTargetTagNames,
  }: {
    targetTagNames?: string[];
  } = {}) =>
  (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (typeof index !== "number" || !isTargetNode(node, targetTagNames)) {
        return;
      }
      const newNode = fromHtml(budouxProcess(toHtml(node)), {
        fragment: true,
      }).children[0];
      newNode && parent?.children.splice(index, 1, newNode);
      return SKIP;
    });
  };

export default rehypeBudoux;
