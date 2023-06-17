import { defineDocumentType } from 'contentlayer/source-files';
import { format, parseISO } from 'date-fns';

export const Fragment = defineDocumentType(() => ({
  name: 'Fragment',
  filePathPattern: `fragments/**/index.mdx`,
  contentType: 'mdx',
  fields: {
    id: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    publishedAt: {
      type: 'date',
      required: true,
    },
    updatedAt: {
      type: 'date',
    },
  },
  computedFields: {
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
