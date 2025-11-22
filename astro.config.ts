import { defineConfig, envField } from "astro/config";

export default defineConfig({
  site: "https://memo.kkhys.me",
  markdown: {
    gfm: false,
    syntaxHighlight: false,
    smartypants: false,
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
