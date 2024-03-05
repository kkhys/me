import { makeSource } from 'contentlayer/source-files';
import rehypeMermaid from 'rehype-mermaid';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';

/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { Legal, Post } from './src/lib/contentlayer/definitions';
import { rehypeMermaidOptions } from './src/lib/mdx/rehype-mermaid';
import {
  afterRehypePrettyCode,
  beforeRehypePrettyCode,
  rehypePrettyCodeOptions,
} from './src/lib/mdx/rehype-pretty-code';
import { linkCardHandler, remarkLinkCard } from './src/lib/mdx/remark-link-card';
import { remarkNextImage } from './src/lib/mdx/remark-next-image';
import { remarkYouTubeEmbed, YouTubeEmbedHandler } from './src/lib/mdx/remark-youtube-embed';

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Legal],
  contentDirExclude: ['README.md'],
  mdx: {
    remarkPlugins: [[remarkGfm], [remarkUnwrapImages], [remarkYouTubeEmbed], [remarkLinkCard], [remarkNextImage]],
    rehypePlugins: [
      [rehypeSlug],
      [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rehypeMermaid,
        rehypeMermaidOptions,
      ],
      [beforeRehypePrettyCode],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      [rehypePrettyCode, rehypePrettyCodeOptions],
      [afterRehypePrettyCode],
    ],
    mdxOptions: (options) => {
      options.remarkRehypeOptions = {
        handlers: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          'link-card': linkCardHandler,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          'youtube-embed': YouTubeEmbedHandler,
        },
      };
      return options;
    },
  },
});
