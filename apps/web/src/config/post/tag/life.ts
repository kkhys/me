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

export type LifeTags = typeof lifeTags;
