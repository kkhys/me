import { transformerNotationDiff } from "@shikijs/transformers";
import type { Element, Root } from "hast";
import { hasProperty } from "hast-util-has-property";
import { isElement } from "hast-util-is-element";
import type { Options } from "rehype-pretty-code";
import { visit } from "unist-util-visit";

export const rehypePrettyCodeOptions = {
  theme: "poimandres",
  transformers: [transformerNotationDiff() as import("shiki").ShikiTransformer],
} satisfies Options;

export const beforeRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (!isElement(node, ["pre"])) {
        return;
      }

      const preElement = node.children[0] as Element;

      if (!isElement(preElement, ["code"])) {
        return;
      }

      const codeElement = preElement.children[0] as Element;

      node.__rawString__ = codeElement.value;
    });
  };
};

export const afterRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (!isElement(node, ["figure"])) {
        return;
      }

      if (!hasProperty(node, "data-rehype-pretty-code-figure")) {
        return;
      }

      for (const child of node.children) {
        if (isElement(child, "pre")) {
          child.properties.__rawString__ = node.__rawString__;
        }
      }
    });
  };
};

declare module "hast" {
  interface Element {
    __rawString__?: string;
    value?: string;
  }
}
