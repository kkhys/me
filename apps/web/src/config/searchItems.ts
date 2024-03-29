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
        title: 'v1.4.0 リリースノート: 脈絡もない機能追加',
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
      {
        title: 'バレンタインデー 2024',
        href: '/posts/p18vcqd',
        emoji: '🍫',
        category: 'Life',
      },
      {
        title: 'セイルチェアの肘掛けを交換した',
        href: '/posts/p16vfnq',
        emoji: '💺',
        category: 'Life',
      },
      {
        title: 'v1.5.0 リリースノート: 回遊率とシェア率向上のための施策',
        href: '/posts/p1g6z2d',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: 'Play Framework のコンパイルに TypeScript を組み込む',
        href: '/posts/p16ceda',
        emoji: '🔧',
        category: 'Tech',
        tags: ['Play Framework', 'TypeScript'],
      },
      {
        title: '人生初の陶芸',
        href: '/posts/p1ys5j8',
        emoji: '🏺',
        category: 'Life',
      },
      {
        title: 'v1.6.0 リリースノート: MDX コンポーネントの強化',
        href: '/posts/p1r60de',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
    ],
  },
] satisfies SearchItem[];
