import type { Element, Root } from 'hast';
import type { Options } from 'rehype-pretty-code';
import { hasProperty } from 'hast-util-has-property';
import { isElement } from 'hast-util-is-element';
import { transformerNotationDiff } from 'shikiji-transformers';
import { visit } from 'unist-util-visit';

export const rehypePrettyCodeOptions = {
  theme: 'poimandres',
  keepBackground: false,
  grid: false,
  transformers: [transformerNotationDiff()],
  onVisitLine(node) {
    visit(node, 'element', (node) => {
      if (!isElement(node, ['span'])) return;
      if (node.children.length === 0)
        node.children = [{ type: 'text', value: ' ' }];
      const codeTextElement = node.children[0] as unknown as Element;
      if (!isElement(codeTextElement, ['span'])) return;
      if (codeTextElement.children.length === 0)
        node.children = [{ type: 'text', value: ' ' }];
    });
  },
} satisfies Options;

export const beforeRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (!isElement(node, ['pre'])) return;
      const preElement = node.children[0] as unknown as Element;
      if (!isElement(preElement, ['code'])) return;
      const codeElement = preElement.children[0] as unknown as Element;
      node.__rawString__ = codeElement.value;
    });
  };
};

export const afterRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (!isElement(node, ['figure'])) return;
      if (!hasProperty(node, 'data-rehype-pretty-code-figure')) return;
      node.children.forEach((child) =>
        isElement(child, 'pre')
          ? (child.properties.__rawString__ = node.__rawString__)
          : null,
      );
    });
  };
};

declare module 'hast' {
  interface Element {
    __rawString__?: string;
    value?: string;
  }
}
