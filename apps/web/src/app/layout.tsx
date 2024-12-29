import "#/styles/globals.css";
import { Toaster, cn } from "@kkhys/ui";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import {
  Inter,
  JetBrains_Mono,
  Newsreader,
  Noto_Sans_JP,
} from "next/font/google";
import { META_THEME_COLORS, me, siteConfig } from "#/config";
import { env } from "#/env";
import { Provider } from "#/providers";
import { SiteFooter, SiteHeader } from "#/ui";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  generator: "Next.js",
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  category: "blog",
  keywords: ["blog", "developer"],
  authors: [
    {
      name: me.name,
      url: `${siteConfig.url}/humans.txt`,
    },
  ],
  creator: me.name,
  publisher: me.name,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    siteId: "5237731",
    creator: me.x.id,
    creatorId: "5237731",
  },
} satisfies Metadata;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
} satisfies Viewport;

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: "italic",
  adjustFontFallback: false,
  variable: "--font-newsreader",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: "normal",
  variable: "--font-jetbrains-mono",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja" suppressHydrationWarning>
    <body
      className={cn(
        "min-h-screen bg-background antialiased",
        notoSansJP.className,
        inter.variable,
        newsreader.variable,
        jetBrainsMono.variable,
      )}
    >
      <Provider>
        <div vaul-drawer-wrapper="">
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="mx-auto w-full border-border/40 dark:border-border max-w-6xl border-x flex-1 flex flex-col">
              <SiteHeader />
              <main className="w-full max-w-2xl mx-auto flex-1">
                <div className="container py-12">{children}</div>
              </main>
              <SiteFooter />
            </div>
          </div>
        </div>
        <Toaster position="top-center" richColors />
      </Provider>
    </body>
    <GoogleTagManager gtmId={env.NEXT_PUBLIC_TAG_MANAGER_ID} />
  </html>
);

export default RootLayout;
