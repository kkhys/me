import { defineDocumentType } from 'contentlayer/source-files';
import { format, parseISO } from 'date-fns';

/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { env } from '../../../env.mjs';
import { Category, Tag } from '../definitions';
import { generateSlug } from '../utils';

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
      type: 'nested',
      of: Category,
      required: true,
    },
    tags: {
      description: 'Tags associated with the post',
      type: 'list',
      of: Tag,
    },
    description: {
      description: 'The description of the post (120 words or less)',
      type: 'string',
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
    url: {
      description: 'Generate post URL from id',
      type: 'string',
      resolve: ({ _id }) => `/posts/${generateSlug(_id)}`,
    },
    editUrl: {
      description: 'URL to github repository of editable blog content',
      type: 'string',
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${env.BLOG_CONTENTS_REPOSITORY_URL}/edit/main/contents/${sourceFilePath}`,
    },
    sourceUrl: {
      description: 'URL to the blog content, without rendering the markdown file',
      type: 'string',
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${env.BLOG_CONTENTS_REPOSITORY_URL}/blob/main/contents/${sourceFilePath}?plain=1`,
    },
    publishedAtFormatted: {
      description: 'Formatted publication date and time',
      type: 'string',
      resolve: ({ publishedAt }) => format(parseISO(publishedAt as string), 'LLLL d, yyyy'),
    },
    updatedAtFormatted: {
      description: 'Formatted modification date and time',
      type: 'string',
      resolve: ({ updatedAt }) => (updatedAt ? format(parseISO(updatedAt as string), 'LLLL d, yyyy') : undefined),
    },
    slug: {
      description: 'Generate post slug from id',
      type: 'string',
      resolve: ({ _id }) => generateSlug(_id),
    },
  },
}));
