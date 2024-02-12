export interface NavItem {
  title: string;
  href: string;
  emoji: string;
  category: string;
  tags?: string[];
}

export interface SearchItem {
  title: string;
  items: NavItem[];
}

export const searchItems = [
  {
    title: 'Posts',
    items: [
      {
        title: '七転び八起き / 2',
        href: '/posts/p1e0lpm',
        emoji: '🏃',
        category: 'Life',
        tags: ['Memorial'],
      },
      {
        title: 'v1.4.0 リリースノート',
        href: '/posts/p1rklfz',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: 'スラッグのこだわり',
        href: '/posts/p1y4nft',
        emoji: '🔗',
        category: 'Tech',
      },
      {
        title: 'フォントのこだわり',
        href: '/posts/p1fw2ts',
        emoji: '🔠',
        category: 'Tech',
      },
      {
        title: 'Mermaid を泳がせる',
        href: '/posts/p1eemm6',
        emoji: '🧜',
        category: 'Tech',
      },
    ],
  },
] satisfies SearchItem[];
