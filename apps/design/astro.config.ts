import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://design.kkhys.me",
  integrations: [sitemap()],
  build: {
    format: "file",
  },
});
