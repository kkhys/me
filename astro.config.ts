import { defineConfig, envField } from "astro/config";
import remarkWordLimit from "./src/lib/remark-word-limit";

export default defineConfig({
  site: "https://memo.kkhys.me",
  markdown: {
    gfm: false,
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkWordLimit],
  },
  env: {
    schema: {
      NODE_ENV: envField.enum({
        context: "client",
        access: "public",
        values: ["development", "production"],
      }),
    },
  },
});
