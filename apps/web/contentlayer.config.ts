import { makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { Post } from './contents/definitions';

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [[remarkGfm]],
    rehypePlugins: [[rehypeSlug]],
  },
});
