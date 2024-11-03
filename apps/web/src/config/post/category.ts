import type { Base } from '.';
import { extractTitle } from '../../lib/contentlayer/utils';

export type Category = Base;
export type CategoryTitle = (typeof categories)[number]['title'];

export const categories = [
  {
    title: 'Tech',
    slug: 'tech',
    emoji: '👩🏻‍💻',
  },
  {
    title: 'Life',
    slug: 'life',
    emoji: '🕯️',
  },
  {
    title: 'Object',
    slug: 'object',
    emoji: '📦',
  },
  {
    title: 'Build',
    slug: 'build',
    emoji: '🏗️',
  },
] as const;

export const categoryTitles = categories.map(extractTitle);
