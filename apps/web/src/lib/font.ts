import {
  Inter,
  JetBrains_Mono,
  Newsreader,
  Noto_Sans_JP,
} from "next/font/google";

export const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: "italic",
  adjustFontFallback: false,
  variable: "--font-newsreader",
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: "normal",
  variable: "--font-jetbrains-mono",
});
