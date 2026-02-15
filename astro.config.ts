import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  site: "https://lgtm.kkhys.me",
  integrations: [
    sitemap(),
    (await import("@playform/compress")).default({
      Image: false,
      SVG: false,
    }),
  ],
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
