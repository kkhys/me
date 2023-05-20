import { defineDocumentType } from 'contentlayer/source-files';
import { format, parseISO } from 'date-fns';

import { SITE_METADATA } from '../../config';
import { Category, Tag } from '../definitions';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/index.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    emoji: {
      type: 'string',
      required: true,
    },
    category: {
      type: 'nested',
      of: Category,
      required: true,
    },
    tags: {
      type: 'list',
      of: Tag,
    },
    description: {
      type: 'string',
    },
    status: {
      type: 'enum',
      options: ['draft', 'published'],
      required: true,
    },
    publishedAt: {
      type: 'date',
      required: true,
    },
    updatedAt: {
      type: 'date',
    },
    slug: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: ({ slug }) => `/p/${slug}`,
    },
    editUrl: {
      type: 'string',
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${SITE_METADATA.repositoryUrl}/edit/main/apps/web/contents/${sourceFilePath}`,
    },
    sourceUrl: {
      type: 'string',
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${SITE_METADATA.repositoryUrl}/blob/main/apps/web/contents/${sourceFilePath}?plain=1`,
    },
    publishedAtFormatted: {
      type: 'string',
      resolve: ({ publishedAt }) =>
        format(parseISO(publishedAt), 'LLLL d, yyyy'),
    },
    updatedAtFormatted: {
      type: 'string',
      resolve: ({ updatedAt }) =>
        updatedAt ? format(parseISO(updatedAt), 'LLLL d, yyyy') : undefined,
    },
  },
}));
