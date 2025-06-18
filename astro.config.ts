import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import expressiveCode from "astro-expressive-code";
import rehypeMermaid from "rehype-mermaid";
import rehypeSlug from "rehype-slug";
import rehypeBudoux from "./src/lib/rehype-budoux";
import rehypePagefind from "./src/lib/rehype-pagefind";
import rehypeSlugWithCustomId from "./src/lib/rehype-slug-with-custom-id";
import remarkBlockQuoteAlert from "./src/lib/remark-blockquote-alert";
import remarkFootnoteTitle from "./src/lib/remark-footnote-title";
import remarkLinkCard from "./src/lib/remark-link-card";
import remarkVideoBlock from "./src/lib/remark-video-block";

let adapter = vercel();

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
  adapter = node({ mode: "standalone" });
}

export default defineConfig({
  site: "https://kkhys.me",
  adapter,
  integrations: [
    expressiveCode({
      themes: ["poimandres", "min-light"],
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: false,
      },
      useThemedScrollbars: false,
      styleOverrides: {
        borderRadius: "0.25rem",
        borderColor: "var(--code-block-border)",
        borderWidth: "1px",
        codeFontSize: "13px",
        codeBackground: "var(--code-block-background)",
        codePaddingBlock: "1.5rem",
        gutterBorderWidth: "0.5px",
        codePaddingInline: "1rem",
        uiPaddingBlock: "0.5rem",
        codeLineHeight: "1.5rem",
        uiFontSize: "13px",
        uiLineHeight: "1.5rem",
        gutterBorderColor: "var(--code-block-border)",
        gutterForeground: "var(--code-block-gutter)",
        frames: {
          terminalTitlebarBackground: "var(--code-block-header-background)",
          terminalTitlebarBorderBottomColor: "var(--code-block-border)",
          terminalBackground: "var(--code-block-background)",
          editorActiveTabBackground: "var(--code-block-header-background)",
          editorActiveTabIndicatorBottomColor: "var(--code-block-border)",
          editorTabBarBorderBottomColor: "var(--code-block-border)",
          editorTabBarBorderColor: "var(--code-block-border)",
          editorTabBarBackground: "var(--code-block-header-background)",
          editorActiveTabForeground: "var(--code-block-header-foreground)",
          inlineButtonBorder: "var(--code-block-border)",
          inlineButtonBorderOpacity: "1",
          inlineButtonBackground: "var(--code-block-background)",
          frameBoxShadowCssValue:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    }),
    react(),
    mdx(),
    sitemap(),
    partytown(),
    (await import("@playform/compress")).default({
      Image: false,
    }),
  ],
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [
      remarkVideoBlock,
      remarkLinkCard,
      remarkFootnoteTitle,
      remarkBlockQuoteAlert,
    ],
    remarkRehype: {
      footnoteLabel: " ",
      footnoteBackLabel: "戻る",
      footnoteLabelTagName: "hr",
    },
    rehypePlugins: [
      rehypeSlug,
      rehypeSlugWithCustomId,
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          mermaidConfig: {
            theme: "base",
            fontFamily: "monospace",
            themeVariables: {
              // TODO: Add more theme variables
            },
          },
          dark: {
            theme: "base",
            fontFamily: "monospace",
            themeVariables: {
              primaryColor: "#b0b0b0",
              secondaryColor: "#545480",
              primaryBorderColor: "#4c4c53",
              primaryTextColor: "#f4f4f5",
              secondaryTextColor: "#f4f4f5",
              lineColor: "#4c4c53",
              textColor: "#f4f4f5",
              mainBkg: "#27272a",
              fontSize: "13px",
              nodeBorder: "#4c4c53",
              clusterBkg: "#2e2d37",
              clusterBorder: "#6e6580",
              titleColor: "#d4b8ef",
              edgeLabelBackground: "#544c00",
              actorBorder: "#4c4c53",
              actorBkg: "#27272a",
              actorTextColor: "#f4f4f5",
              signalColor: "#f4f4f5",
              signalTextColor: "#f4f4f5",
              labelBoxBkgColor: "#27272a",
              labelBoxBorderColor: "#4c4c53",
              labelTextColor: "#f4f4f5",
              loopTextColor: "#faf#f4d701afa",
              noteBorderColor: "#7b731a",
              noteBkgColor: "#484826",
              noteTextColor: "#f4d701",
              sequenceNumberColor: "#27272a",
              git0: "#808080",
              git1: "#4c4c53",
              git2: "#545480",
              git3: "#867d80",
              git4: "#54806f",
              git5: "#75807d",
              git6: "#b0b0b0",
              git7: "#80547c",
              gitBranchLabel0: "#f4f4f5",
              gitBranchLabel1: "#f4f4f5",
              gitBranchLabel2: "#f4f4f5",
              gitBranchLabel3: "#f4f4f5",
              gitBranchLabel4: "#f4f4f5",
              gitBranchLabel5: "#f4f4f5",
              gitBranchLabel6: "#f4f4f5",
              gitBranchLabel7: "#f4f4f5",
              tagLabelColor: "#f4d701",
              tagLabelBackground: "#484826",
              tagLabelBorder: "#7b731a",
              tagLabelFontSize: "10px",
              commitLabelColor: "#f4f4f5",
              commitLabelBackground: "#62626a",
              commitLabelFontSize: "10px",
              transitionColor: "#4c4c53",
              stateLabelColor: "#f4f4f5",
              stateBkg: "#27272a",
              innerEndBackground: "#27272a",
              specialStateColor: "#4c4c53",
            },
          },
        },
      ],
      rehypeBudoux,
      rehypePagefind,
    ],
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    service:
      process.env.VERCEL_ENV === "preview" ||
      process.env.GITHUB_ACTIONS === "true"
        ? { entrypoint: "astro/assets/services/noop" }
        : { entrypoint: "astro/assets/services/sharp" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      GITHUB_ACCESS_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      SPOTIFY_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SPOTIFY_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      SPOTIFY_REFRESH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      UPSTASH_REDIS_REST_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      PUBLIC_VERCEL_ENV: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "development",
      }),
      PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_VERCEL_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      NODE_ENV: envField.enum({
        context: "client",
        access: "public",
        values: ["development", "production"],
      }),
    },
  },
});
