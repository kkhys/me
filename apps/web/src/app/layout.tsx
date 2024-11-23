import "#/styles/globals.css";
import { cn } from "@kkhys/ui";
import type { Metadata, Viewport } from "next";
import { META_THEME_COLORS, siteConfig } from "#/config";
import { inter, jetBrainsMono, newsreader, notoSansJP } from "#/lib/fonts";
import { Provider } from "#/providers";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
} satisfies Metadata;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
} satisfies Viewport;

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
        <div className="relative flex min-h-screen flex-col bg-background">
          {children}
        </div>
      </Provider>
    </body>
    {/*<GoogleTagManager gtmId={site.google.tagManagerId} />*/}
  </html>
);

export default RootLayout;
