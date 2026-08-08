import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://diary.kkhys.me",
  integrations: [sitemap()],
  build: {
    format: "file",
  },
  image: {
    service:
      process.env.USE_FIXTURE_DATA === "true"
        ? { entrypoint: "astro/assets/services/noop" }
        : { entrypoint: "astro/assets/services/sharp" },
  },
});
