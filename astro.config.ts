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
import rehypeSlugWithCustomId from "./src/lib/rehype-slug-with-custom-id";
import remarkBlockQuoteAlert from "./src/lib/remark-blockquote-alert";
import remarkFootnoteTitle from "./src/lib/remark-footnote-title";
import remarkLinkCard from "./src/lib/remark-link-card";
import remarkTweetBlock from "./src/lib/remark-tweet-block";
import remarkVideoBlock from "./src/lib/remark-video-block";
import remarkYoutubeBlock from "./src/lib/remark-youtube-block";

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
      remarkTweetBlock,
      remarkVideoBlock,
      remarkYoutubeBlock,
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
              // Colors mapped to uchu palette hex approximations
              primaryColor: "#b2b2b1", // uchu-gray-5 (80.73%)
              secondaryColor: "#545480",
              primaryBorderColor: "#5a5c63", // uchu-yin-7 (43.87%)
              primaryTextColor: "#f0f0f1", // uchu-gray-1 (95.57%)
              secondaryTextColor: "#f0f0f1", // uchu-gray-1
              lineColor: "#5a5c63", // uchu-yin-7
              textColor: "#f0f0f1", // uchu-gray-1
              mainBkg: "#2b2d33", // uchu-yin-9 (25.11%)
              fontSize: "13px",
              nodeBorder: "#5a5c63", // uchu-yin-7
              clusterBkg: "#2b2d33", // uchu-yin-9
              clusterBorder: "#5a4d6f", // uchu-purple-7 (42.77%)
              titleColor: "#c8a8e8", // uchu-purple-2 (78.68%)
              edgeLabelBackground: "#544c00",
              actorBorder: "#5a5c63", // uchu-yin-7
              actorBkg: "#2b2d33", // uchu-yin-9
              actorTextColor: "#f0f0f1", // uchu-gray-1
              signalColor: "#f0f0f1", // uchu-gray-1
              signalTextColor: "#f0f0f1", // uchu-gray-1
              labelBoxBkgColor: "#2b2d33", // uchu-yin-9
              labelBoxBorderColor: "#5a5c63", // uchu-yin-7
              labelTextColor: "#f0f0f1", // uchu-gray-1
              loopTextColor: "#f0f0f1", // uchu-gray-1 (fixed typo)
              noteBorderColor: "#7b731a", // uchu-yellow-8 (69.14%)
              noteBkgColor: "#484826", // uchu-yellow-9 (62.29%)
              noteTextColor: "#f4d701", // uchu-yellow-5 (89%)
              sequenceNumberColor: "#2b2d33", // uchu-yin-9
              git0: "#808080",
              git1: "#5a5c63", // uchu-yin-7
              git2: "#545480",
              git3: "#867d80",
              git4: "#54806f",
              git5: "#75807d",
              git6: "#b2b2b1", // uchu-gray-5
              git7: "#80547c",
              gitBranchLabel0: "#f0f0f1", // uchu-gray-1
              gitBranchLabel1: "#f0f0f1",
              gitBranchLabel2: "#f0f0f1",
              gitBranchLabel3: "#f0f0f1",
              gitBranchLabel4: "#f0f0f1",
              gitBranchLabel5: "#f0f0f1",
              gitBranchLabel6: "#f0f0f1",
              gitBranchLabel7: "#f0f0f1",
              tagLabelColor: "#f4d701", // uchu-yellow-5
              tagLabelBackground: "#484826", // uchu-yellow-9
              tagLabelBorder: "#7b731a", // uchu-yellow-8
              tagLabelFontSize: "10px",
              commitLabelColor: "#f0f0f1", // uchu-gray-1
              commitLabelBackground: "#62626a",
              commitLabelFontSize: "10px",
              transitionColor: "#5a5c63", // uchu-yin-7
              stateLabelColor: "#f0f0f1", // uchu-gray-1
              stateBkg: "#2b2d33", // uchu-yin-9
              innerEndBackground: "#2b2d33", // uchu-yin-9
              specialStateColor: "#5a5c63", // uchu-yin-7
            },
          },
        },
      ],
      rehypeBudoux,
    ],
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    service:
      process.env.VERCEL_ENV === "preview" ||
      process.env.GITHUB_ACTIONS === "true"
        ? { entrypoint: "astro/assets/services/noop" }
        : { entrypoint: "astro/assets/services/sharp" },
    responsiveStyles: true,
    layout: "constrained",
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["react-tweet"],
    },
  },
  env: {
    schema: {
      GITHUB_ACCESS_TOKEN: envField.string({
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
