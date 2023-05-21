import bs58 from 'bs58';
import { defineDocumentType } from 'contentlayer/source-files';
import { format, parseISO } from 'date-fns';
import jsSHA from 'jssha';
import ripemd160 from 'ripemd160';

import { SITE_METADATA } from '../../config';
import { Category, Tag } from '../definitions';

const getSlug = (id: string) => {
  const sha256Object = new jsSHA('SHA3-256', 'TEXT', { encoding: 'UTF8' });
  const sha512Object = new jsSHA('SHA3-512', 'TEXT', { encoding: 'UTF8' });

  const sha256Hash = sha256Object.update(id).getHash('HEX');

  const sha512Hash = sha512Object
    .update(Buffer.from(sha256Hash, 'hex').toString('hex'))
    .getHash('HEX');

  const ripemd160Hash = new ripemd160()
    .update(Buffer.from(sha512Hash, 'hex'))
    .digest();

  const reHash = sha512Object
    .update(
      Buffer.from('00' + ripemd160Hash.toString('hex'), 'hex').toString('hex'),
    )
    .getHash('HEX');

  const checksum = sha512Object
    .update(Buffer.from(reHash, 'hex').toString('hex'))
    .getHash('HEX')
    .substring(0, 8);

  return bs58.encode(Buffer.from(checksum + reHash, 'hex')).substring(0, 32);
};

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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: ({ _id }) => `/p/${getSlug(_id)}`,
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
    slug: {
      type: 'string',
      resolve: ({ _id }) => getSlug(_id),
    },
  },
}));
