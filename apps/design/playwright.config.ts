import { defineConfig } from "@playwright/test";

/* Visual regression for the design system pages. Baselines are rendered on
   the developer machine (macOS system fonts) and compared locally — this is
   not wired into `pnpm test`, mirroring how deploys run locally too. */
export default defineConfig({
  testDir: "./vrt",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  webServer: {
    /* vrt/serve.mjs instead of `astro preview`: preview daemonizes without a
       TTY, which breaks Playwright's webServer lifecycle. */
    command: "astro build && node vrt/serve.mjs 4381",
    url: "http://localhost:4381",
    /* Never reuse: a stray dev server on the port would silently get
       screenshotted instead of the built site. */
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://localhost:4381",
    viewport: { width: 1200, height: 900 },
  },
  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } },
  ],
});
