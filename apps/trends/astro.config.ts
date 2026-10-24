import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";
import { verifyPagefindIndex } from "./src/features/search/verify-index";

export default defineConfig({
  site: "https://trends.kkhys.me",
  integrations: [sitemap(), pagefind(), verifyPagefindIndex()],
  build: {
    format: "file",
  },
  vite: {
    resolve: {
      // satori bundles harfbuzzjs, whose Emscripten glue reads `__dirname` and
      // loads `hb.wasm` from beside itself. Both break once inlined into the ESM
      // prerender bundle, so resolve it from node_modules at runtime instead.
      external: ["satori"],
    },
  },
});
