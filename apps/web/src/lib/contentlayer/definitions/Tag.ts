import { defineNestedType } from 'contentlayer/source-files';

/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { allTagNames, allTagSlugs } from '../constants';

export const Tag = defineNestedType(() => ({
  name: 'Tag',
  fields: {
    title: {
      type: 'enum',
      required: true,
      options: allTagNames,
    },
    slug: {
      type: 'enum',
      required: true,
      options: allTagSlugs,
    },
  },
}));
