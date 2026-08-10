import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://trends.kkhys.me",
  integrations: [sitemap()],
  build: {
    format: "file",
  },
});
