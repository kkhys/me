import type { Element, Root } from 'hast';
import { hasProperty } from 'hast-util-has-property';
import { isElement } from 'hast-util-is-element';
import type { Options } from 'rehype-pretty-code';
import { transformerNotationDiff } from 'shikiji-transformers';
import { visit } from 'unist-util-visit';

export const rehypePrettyCodeOptions = {
  theme: 'poimandres',
  keepBackground: false,
  grid: false,
  transformers: [transformerNotationDiff()],
} satisfies Options;

export const beforeRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (!isElement(node, ['pre'])) return;
      const preElement = node.children[0] as unknown as Element;
      if (!isElement(preElement, ['code'])) return;
      const codeElement = preElement.children[0] as unknown as Element;
      node.raw = codeElement.value;
    });
  };
};

export const afterRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (!isElement(node, ['figure'])) return;
      if (!hasProperty(node, 'data-rehype-pretty-code-figure')) return;
      node.children.forEach((child) => (isElement(child, 'pre') ? (child.properties.raw = node.raw) : null));
    });
  };
};

declare module 'hast' {
  interface Element {
    raw?: string;
    value?: string;
  }
}
