import { makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaidjs';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Post } from './contents/definitions';

const rehypePrettyCodeOptions: Partial<Options> = {
  theme: 'one-dark-pro',
  tokensMap: {
    fn: 'entity.name.function',
    objKey: 'meta.object-literal.key',
  },
  // onVisitLine(node) {
  //   if (node.children.length === 0) {
  //     node.children = [{ type: 'text', value: ' ' }];
  //   }
  //   node.properties.className = [''];
  // },
  // onVisitHighlightedLine(node) {
  //   node.properties.className.push(
  //     '!border-l-rose-300/70 bg-rose-200/10 before:!text-white/70',
  //   );
  // },
};

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [[remarkGfm], [remarkGemoji], [remarkMath]],
    rehypePlugins: [
      [rehypeSlug],
      [rehypeKatex],
      [
        rehypeMermaid,
        {
          strategy: 'inline-svg',
          mermaidConfig: {
            fontFamily: 'sans-serif, monospace',
          },
        },
      ],
      // [rehypePrettyCodeClasses],
      [rehypePrettyCode, rehypePrettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        // {
        //   behavior: 'wrap',
        //   properties: {
        //     className: [HEADING_LINK_ANCHOR],
        //   },
        // },
      ],
    ],
  },
});
