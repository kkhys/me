import { defineNestedType } from 'contentlayer/source-files';

/**
 * esbuild はモジュールパスエイリアスに対応していないので相対パスを使用している。
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { allCategoryNames, allCategorySlugs } from '../../lib/contentlayer';

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
