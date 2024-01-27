import { Inter, JetBrains_Mono, Newsreader, Noto_Emoji, Noto_Sans_JP } from 'next/font/google';

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap', variable: '--font-inter' });

export const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  style: 'italic',
  adjustFontFallback: false,
  variable: '--font-newsreader',
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  style: 'normal',
  variable: '--font-jetbrains-mono',
});

export const notoEmoji = Noto_Emoji({
  subsets: ['emoji'],
  display: 'swap',
  weight: '600',
  style: 'normal',
  variable: '--font-noto-emoji',
});
