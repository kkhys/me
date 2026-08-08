import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  site: "https://lgtm.kkhys.me",
  build: {
    format: "file",
  },
  integrations: [
    react(),
    sitemap({
      // Non-first gallery pages are noindex and redirect direct visits;
      // advertising them in the sitemap sends crawlers a mixed signal.
      filter: (page) => !/^\/\d+$/u.test(new URL(page).pathname),
    }),
    (await import("@playform/compress")).default({
      Image: false,
      SVG: false,
    }),
  ],
  env: {
    schema: {
      GITHUB_ACTIONS: envField.boolean({
        context: "client",
        access: "public",
        optional: true,
        default: false,
      }),
    },
  },
});
