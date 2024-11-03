export const buildTags = [
  {
    title: 'Desk',
    slug: 'desk',
    emoji: '🪑',
  },
  {
    title: 'Pottery',
    slug: 'pottery',
    emoji: '🏺',
  },
  {
    title: 'Clothes',
    slug: 'clothes',
    emoji: '👗',
  },
] as const;

export type BuildTags = typeof buildTags;
