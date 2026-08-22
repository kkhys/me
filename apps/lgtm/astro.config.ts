import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

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
  vite: {
    resolve: {
      // satori bundles harfbuzzjs, whose Emscripten glue reads `__dirname` and
      // loads `hb.wasm` from beside itself. Both break once inlined into the ESM
      // prerender bundle, so resolve it from node_modules at runtime instead.
      external: ["satori"],
    },
  },
});
