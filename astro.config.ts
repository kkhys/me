import { defineConfig, envField } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkExtractLink from "./src/lib/remark-extract-link";
import remarkTruncateLinkText from "./src/lib/remark-truncate-link-text";
import remarkWordLimit from "./src/lib/remark-word-limit";

export default defineConfig({
  site: "https://memo.kkhys.me",
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkWordLimit, remarkExtractLink, remarkTruncateLinkText],
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
      GITHUB_ACTIONS: envField.boolean({
        context: "client",
        access: "public",
        optional: true,
        default: false,
      }),
      PUBLIC_VERCEL_ENV: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
});
