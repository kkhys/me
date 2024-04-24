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
    title: 'Release',
    slug: 'release',
    emoji: '🚀',
  },
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
  {
    title: 'Play Framework',
    slug: 'play-framework',
    emoji: '▶️',
  },
  {
    title: 'Next.js',
    slug: 'next-js',
    emoji: '🔼',
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
  },
  {
    title: 'Essay',
    slug: 'essay',
    emoji: '📝',
  },
  {
    title: 'Poor writing',
    slug: 'poor-writing',
    emoji: '🗑️',
  },
] as const;

export const fashionTags = [
  {
    title: 'Handmade',
    slug: 'handmade',
    emoji: '🧶',
  },
] as const;

/**
 * Extracts the 'title' property from the given object.
 *
 * @template T - The type of object containing the 'title' property.
 * @param item - The object from which to extract the 'title'.
 * @return The value of the 'title' property.
 */
export const extractTitle = <T extends Pick<Base, 'title'>>(item: T) => item.title;

export const categoryTitles = categories.map(extractTitle);

export const allTags = [...techTags, ...lifeTags, ...fashionTags];

export const allTagTitles = allTags.map(extractTitle);
