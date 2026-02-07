import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import expressiveCode from "astro-expressive-code";
import rehypeMermaid from "rehype-mermaid";
import rehypeSlug from "rehype-slug";
import { expressiveCodeOptions } from "./src/lib/expressive-code";
import rehypeBudoux from "./src/lib/rehype-budoux";
import { rehypeMermaidOptions } from "./src/lib/rehype-mermaid-options";
import rehypeSlugWithCustomId from "./src/lib/rehype-slug-with-custom-id";
import remarkBlockQuoteAlert from "./src/lib/remark-blockquote-alert";
import remarkFootnoteTitle from "./src/lib/remark-footnote-title";
import remarkLinkCard from "./src/lib/remark-link-card";
import remarkTweetBlock from "./src/lib/remark-tweet-block";
import remarkVideoBlock from "./src/lib/remark-video-block";
import remarkYoutubeBlock from "./src/lib/remark-youtube-block";

export default defineConfig({
  site: "https://kkhys.me",
  integrations: [
    expressiveCode(expressiveCodeOptions),
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
      [rehypeMermaid, rehypeMermaidOptions],
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
