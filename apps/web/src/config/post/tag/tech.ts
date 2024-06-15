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
  {
    title: 'Security',
    slug: 'security',
    emoji: '🔒',
  },
] as const;

export type TechTags = typeof techTags;
