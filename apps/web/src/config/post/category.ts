import type { Base } from '.';
import { extractTitle } from '.';

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
    title: 'Fashion',
    slug: 'fashion',
    emoji: '👗',
  },
] as const;

export const categoryTitles = categories.map(extractTitle);
