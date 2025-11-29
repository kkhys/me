import { defineConfig, envField } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkWordLimit from "./src/lib/remark-word-limit";

export default defineConfig({
  site: "https://memo.kkhys.me",
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkWordLimit],
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
    },
  },
});
