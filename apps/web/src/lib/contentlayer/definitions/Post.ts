import { defineDocumentType } from 'contentlayer/source-files';
import { format, parseISO } from 'date-fns';

import { content } from '../../../config';
/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { allTagTitles, categoryTitles } from '../constants';
import { createExcerpt, generateCategoryObject, generateSlug, generateTagObject } from '../utils';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  description: 'Blog posts',
  filePathPattern: `posts/**/index.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      description: 'The title of the post',
      type: 'string',
      required: true,
    },
    emoji: {
      description: 'Emoji rendered as hero image',
      type: 'string',
      required: true,
    },
    category: {
      description: 'The category of the post',
      type: 'enum',
      options: categoryTitles,
      required: true,
    },
    tags: {
      description: 'Tags associated with the post',
      type: 'list',
      of: { type: 'enum', options: allTagTitles },
    },
    status: {
      description: 'Whether to publish the post',
      type: 'enum',
      options: ['draft', 'published'],
      required: true,
    },
    publishedAt: {
      description: 'Post publication date and time',
      type: 'date',
      required: true,
    },
    updatedAt: {
      description: 'Post modification data and time',
      type: 'date',
    },
  },
  computedFields: {
    excerpt: {
      description: 'The description of the post (120 words or less)',
      type: 'string',
      resolve: async ({ body: { raw } }) => await createExcerpt(raw),
    },
    url: {
      description: 'Generate post URL from id',
      type: 'string',
      resolve: ({ _id }) => `/posts/${generateSlug(_id)}`,
    },
    editUrl: {
      description: 'URL to github repository of editable blog content',
      type: 'string',
      resolve: ({ _raw: { sourceFilePath } }) => `${content.url.repository}/edit/main/${sourceFilePath}`,
    },
    sourceUrl: {
      description: 'URL to the blog content, without rendering the markdown file',
      type: 'string',
      resolve: ({ _raw: { sourceFilePath } }) => `${content.url.repository}/blob/main/${sourceFilePath}?plain=1`,
    },
    publishedAtFormattedUs: {
      description: 'Formatted publication date and time',
      type: 'string',
      resolve: ({ publishedAt }) => format(parseISO(publishedAt), 'LLLL d, yyyy'),
    },
    publishedAtFormattedIso: {
      description: 'Formatted publication date and time',
      type: 'string',
      resolve: ({ publishedAt }) => format(parseISO(publishedAt), 'yyyy/MM/dd'),
    },
    updatedAtFormattedUs: {
      description: 'Formatted modification date and time',
      type: 'string',
      resolve: ({ updatedAt }) => (updatedAt ? format(parseISO(updatedAt), 'LLLL d, yyyy') : undefined),
    },
    updatedAtFormattedIso: {
      description: 'Formatted modification date and time',
      type: 'string',
      resolve: ({ updatedAt }) => (updatedAt ? format(parseISO(updatedAt), 'yyyy/MM/dd') : undefined),
    },
    slug: {
      description: 'Generate post slug from id',
      type: 'string',
      resolve: ({ _id }) => generateSlug(_id),
    },
    categoryObject: {
      description: 'Create a category object from a category title',
      type: 'json',
      resolve: ({ category }) => generateCategoryObject(category),
    },
    tagObjectList: {
      description: 'Create a list of tab objects from tag titles',
      type: 'list',
      resolve: ({ tags, category }) => {
        if (!tags) return undefined;
        return Array.from(tags).map((tag) => generateTagObject(tag, category));
      },
    },
  },
}));
