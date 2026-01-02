import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kkhys.me",
  integrations: [sitemap()],
});
