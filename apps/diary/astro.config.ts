import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://diary.kkhys.me",
  integrations: [sitemap()],
  build: {
    format: "file",
  },
  image: {
    remotePatterns: [{ protocol: "https" }],
    service:
      process.env.GITHUB_ACTIONS === "true"
        ? { entrypoint: "astro/assets/services/noop" }
        : { entrypoint: "astro/assets/services/sharp" },
  },
});
