/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
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
  return (tree: any) => {
    visit(
      tree,
      (node: any) => node.type === 'element' && node.tagName === 'pre',
      (node) => (node.raw = node.children[0].children[0].value),
    );
  };
};

export const afterRehypePrettyCode = () => {
  return (tree: any) => {
    visit(
      tree,
      (node: any) =>
        node.type === 'element' && node.tagName === 'figure' && 'data-rehype-pretty-code-figure' in node.properties,
      (node: any) => {
        node.children.forEach((child: any) => (child.tagName === 'pre' ? (child.properties.raw = node.raw) : null));
      },
    );
  };
};
