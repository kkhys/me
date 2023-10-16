import { extractTitle } from './utils';

export type Base = Record<'title' | 'slug' | 'emoji', string>;
export type Category = Base;
export type Tag = Base;
export type CategoryTitle = (typeof categories)[number]['title'];
export type AllTagsTitle = (typeof allTags)[number]['title'];
export type TechTags = typeof techTags;
export type LifeTags = typeof lifeTags;
export type FashionTags = typeof fashionTags;

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

export const techTags = [
  {
    title: 'TypeScript',
    slug: 'typescript',
    emoji: '📘',
  },
  {
    title: 'React',
    slug: 'react',
    emoji: '⚛️',
  },
] as const;

export const lifeTags = [
  {
    title: 'Travel',
    slug: 'travel',
    emoji: '🌎',
  },
  {
    title: 'Memorial',
    slug: 'memorial',
    emoji: '🌸',
  }
] as const;

export const fashionTags = [
  {
    title: 'Handmade',
    slug: 'handmade',
    emoji: '🧶',
  },
] as const;

export const categoryTitles = categories.map(extractTitle);

export const allTags = [...techTags, ...lifeTags, ...fashionTags];

export const allTagTitles = allTags.map(extractTitle);
