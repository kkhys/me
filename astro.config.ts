import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://memo.kkhys.me",
  markdown: {
    gfm: false,
    syntaxHighlight: false,
    smartypants: false,
  },
});
