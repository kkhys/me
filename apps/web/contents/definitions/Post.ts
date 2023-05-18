import { defineDocumentType } from 'contentlayer/source-files';

import { Tag } from '../definitions';

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
      type: 'enum',
      options: ['test', 'test2'],
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
      resolve: (document) => `/posts/${document.slug}`,
    },
  },
}));
