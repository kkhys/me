import { Inter, JetBrains_Mono, Newsreader, Noto_Sans_JP } from 'next/font/google';

export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

export const inter = Inter({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--font-inter' });

export const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: 'italic',
  display: 'swap',
  variable: '--font-newsreader',
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: 'normal',
  display: 'swap',
  variable: '--font-jetbrains-mono',
});
