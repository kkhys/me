import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";
import { verifyPagefindIndex } from "./src/integrations/verify-pagefind-index";

export default defineConfig({
  site: "https://design.kkhys.me",
  integrations: [
    sitemap({
      /* /preview/* are iframe-only demo documents, not pages. */
      filter: (page) => !page.includes("/preview/"),
    }),
    pagefind(),
    verifyPagefindIndex(),
  ],
  build: {
    format: "file",
  },
});
