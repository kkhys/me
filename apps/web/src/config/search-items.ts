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
        href: '/posts/p1vdu33',
        emoji: '💺',
        category: 'Build',
        tags: ['Desk'],
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
        href: '/posts/p1wcla5',
        emoji: '🏺',
        category: 'Life',
        tags: ['Pottery'],
      },
      {
        title: 'v1.6.0 リリースノート: MDX コンポーネントの強化',
        href: '/posts/p1r60de',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: 'バリ島旅行記',
        href: '/posts/p1v00e8',
        emoji: '🏝',
        category: 'Life',
        tags: ['Travel'],
      },
      {
        title: 'v1.7.0 リリースノート: PV カウント',
        href: '/posts/p1v9jvx',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: 'Next.js では searchParams の扱いにご用心',
        href: '/posts/p1srf75',
        emoji: '🔼',
        category: 'Tech',
        tags: ['Next.js'],
      },
      {
        title: 'Web API の開発時に最低限覚えておくべきこと',
        href: '/posts/p1ua4wh',
        emoji: '🔌',
        category: 'Tech',
      },
      {
        title: '新しいカメラを買った',
        href: '/posts/p1672pu',
        emoji: '📷',
        category: 'Object',
      },
      {
        title: 'デスク構成スナップショット 2024',
        href: '/posts/p1v6tlh',
        emoji: '🖥',
        category: 'Object',
      },
      {
        title: 'Noto Emoji を SVG 化する API を作る',
        href: '/posts/p15e6x7',
        emoji: '🔄',
        category: 'Tech',
      },
      {
        title: 'v1.8.0 リリースノート: グローバルナビゲーションの追加など',
        href: '/posts/p1c8jpk',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: '月の土地をもらった',
        href: '/posts/p1n03k6',
        emoji: '🌜',
        category: 'Life',
      },
      {
        title: 'OWASP ASVS から考えるパスワード要件',
        href: '/posts/p164vu8',
        emoji: '🔑',
        category: 'Tech',
        tags: ['Security'],
      },
      {
        title: 'エストニア電子国民として',
        href: '/posts/p1t6el8',
        emoji: '🇪🇪',
        category: 'Life',
      },
      {
        title: 'Animations on the web に登録した',
        href: '/posts/p1gvayx',
        emoji: '🧈',
        category: 'Tech',
      },
      {
        title: 'Vercel ビルド時に Playwright をインストールする',
        href: '/posts/p128uug',
        emoji: '🎭',
        category: 'Tech',
      },
      {
        title: 'v1.9.0 リリースノート: Medium 風の画像ズーム機能を追加',
        href: '/posts/p1kqv7s',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: '技術書にぴったりな文鎮',
        href: '/posts/p1qhr64',
        emoji: '📗',
        category: 'Object',
      },
      {
        title: 'v1.10.0 リリースノート: お問い合わせ機能の追加',
        href: '/posts/p143t9d',
        emoji: '🚀',
        category: 'Tech',
        tags: ['Release'],
      },
      {
        title: 'Redis を使った PV カウントに切り替える',
        href: '/posts/p1ydlf6',
        emoji: '🛢️',
        category: 'Tech',
      },
      {
        title: '星野リゾート「界アンジン」でのんびり',
        href: '/posts/p15p4yn',
        emoji: '⛵️',
        category: 'Life',
      },
      {
        title: 'Vultr + Arch Linux で Mastodon を構築する',
        href: '/posts/p1ffkqq',
        emoji: '🦣',
        category: 'Tech',
      },
      {
        title: 'さよなら、My 自作 PC',
        href: '/posts/p1ppkfs',
        emoji: '🖥️',
        category: 'Object',
      },
    ],
  },
] satisfies SearchItem[];
