import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const useFixtureData = process.env.USE_FIXTURE_DATA === "true";

export default defineConfig({
  site: "https://art.kkhys.me",
  integrations: [sitemap()],
  build: {
    format: "file",
  },
  vite: {
    resolve: {
      // `import.meta.glob` patterns must be literals, so each image tree is its
      // own module and the alias picks one; an `eager` glob in a dead branch
      // would still bundle every art-content image into a fixture build.
      alias: {
        "#gallery-images": fileURLToPath(
          new URL(
            useFixtureData ? "./src/lib/images/fixtures.ts" : "./src/lib/images/art-content.ts",
            import.meta.url,
          ),
        ),
      },
      // satori bundles harfbuzzjs, whose Emscripten glue reads `__dirname` and
      // loads `hb.wasm` from beside itself. Both break once inlined into the ESM
      // prerender bundle, so resolve it from node_modules at runtime instead.
      external: ["satori"],
    },
  },
  image: {
    service: useFixtureData
      ? { entrypoint: "astro/assets/services/noop" }
      : { entrypoint: "astro/assets/services/sharp" },
  },
});
