import type { Element, Root } from 'hast';
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
      if (node.tagName === 'pre') {
        const preElement = node.children[0] as unknown as Element;
        const codeElement = preElement.children[0] as unknown as Element;
        node.raw = codeElement.value;
      }
    });
  };
};

export const afterRehypePrettyCode = () => {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'figure' && 'data-rehype-pretty-code-figure' in node.properties) {
        (node.children as Element[]).forEach((child) =>
          child.tagName === 'pre' ? (child.properties.raw = node.raw) : null,
        );
      }
    });
  };
};

declare module 'hast' {
  interface Element {
    raw?: string;
    value?: string;
  }
}
