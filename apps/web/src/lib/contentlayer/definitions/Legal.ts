import { defineDocumentType } from 'contentlayer/source-files';

export const Legal = defineDocumentType(() => ({
  name: 'Legal',
  description: 'Legal documents',
  filePathPattern: `legal/**/*.md`,
  fields: {
    title: {
      description: 'The title of the legal document',
      type: 'string',
      required: true,
    },
    publishedAt: {
      description: 'Legal document publication date and time',
      type: 'date',
      required: true,
    },
    updatedAt: {
      description: 'Legal document modification data and time',
      type: 'date',
    },
  },
}));
