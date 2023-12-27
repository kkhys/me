import { Inter, JetBrains_Mono, Newsreader, Noto_Emoji, Noto_Sans_JP } from 'next/font/google';

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

export const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-inter' });

export const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: 'italic',
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-newsreader',
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: 'normal',
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const notoEmoji = Noto_Emoji({
  subsets: ['emoji'],
  display: 'swap',
  style: 'normal',
  weight: '700',
  variable: '--font-noto-emoji',
});
