import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";
import expressiveCode from "astro-expressive-code";
import rehypeSlug from "rehype-slug";
import { expressiveCodeOptions } from "./src/lib/expressive-code";
import rehypeBudoux from "./src/lib/rehype-budoux";
import rehypeMermaidCached from "./src/lib/rehype-mermaid-cached";
import rehypeSlugWithCustomId from "./src/lib/rehype-slug-with-custom-id";
import remarkBlockQuoteAlert from "./src/lib/remark-blockquote-alert";
import remarkFootnoteTitle from "./src/lib/remark-footnote-title";
import remarkLinkCard from "./src/lib/remark-link-card";
import remarkUnwrapImages from "./src/lib/remark-unwrap-images";
import remarkYoutubeBlock from "./src/lib/remark-youtube-block";

export default defineConfig({
  site: "https://kkhys.me",
  integrations: [
    expressiveCode(expressiveCodeOptions),
    react(),
    mdx(),
    sitemap(),
  ],
  build: {
    format: "file",
  },
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [
      remarkUnwrapImages,
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
      rehypeMermaidCached,
      rehypeBudoux,
    ],
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    service:
      process.env.GITHUB_ACTIONS === "true"
        ? { entrypoint: "astro/assets/services/noop" }
        : { entrypoint: "astro/assets/services/sharp" },
  },
  vite: {
    plugins: [],
  },
  env: {
    schema: {
      GITHUB_ACCESS_TOKEN: envField.string({
        context: "server",
        access: "secret",
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
