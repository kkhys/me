import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import { SITE_URL } from "./src/config/constants";
import remarkEscapeSyntax from "./src/lib/remark-escape-syntax";
import remarkExtractLink from "./src/lib/remark-extract-link";
import remarkTruncateLinkText from "./src/lib/remark-truncate-link-text";
import remarkWordLimit from "./src/lib/remark-word-limit";

export default defineConfig({
  site: SITE_URL,
  build: {
    format: "file",
  },
  integrations: [
    sitemap(),
    (await import("@playform/compress")).default({
      Image: false,
      SVG: false,
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [
      remarkEscapeSyntax,
      remarkWordLimit,
      remarkExtractLink,
      remarkTruncateLinkText,
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          properties: { className: "external-link" },
        },
      ],
    ],
  },
  env: {
    schema: {
      NODE_ENV: envField.enum({
        context: "client",
        access: "public",
        values: ["development", "production"],
      }),
      PUBLIC_DEPLOY_ENV: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  experimental: {
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
      contentCache: true,
    },
  },
});
