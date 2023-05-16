import { makeSource } from 'contentlayer/source-files';
import remarkGfm from 'remark-gfm';

import { Post } from './contents/definitions';

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [[remarkGfm]],
  },
});
