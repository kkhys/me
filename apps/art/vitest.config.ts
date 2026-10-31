import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#gallery-images": path.resolve(__dirname, "./src/lib/images/fixtures.ts"),
      "#": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    exclude: ["node_modules", ".direnv", "dist"],
    coverage: {
      include: ["src/{config,lib,loaders,utils}/**/*.ts"],
      thresholds: {
        lines: 92.52,
        functions: 96.96,
        branches: 97.5,
        statements: 93.49,
        autoUpdate: true,
      },
    },
  },
});
