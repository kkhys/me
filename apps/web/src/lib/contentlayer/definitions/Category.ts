import { defineNestedType } from 'contentlayer/source-files';

/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { allCategoryNames, allCategorySlugs } from '../constants';

export const Category = defineNestedType(() => ({
  name: 'Category',
  fields: {
    title: {
      type: 'enum',
      required: true,
      options: allCategoryNames,
    },
    slug: {
      type: 'enum',
      required: true,
      options: allCategorySlugs,
    },
  },
}));
