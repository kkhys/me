import { makeSource } from 'contentlayer/source-files';

/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { Post } from './src/lib/contentlayer/definitions';

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
  mdx: {},
});
