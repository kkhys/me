import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      include: ["src/utils/*.ts", "src/lib/*.ts", "src/loaders/*.ts", "src/features/**/*.ts"],
      exclude: ["src/utils/image.ts", "src/loaders/memo-loader.ts"],
      thresholds: {
        lines: 98.03,
        functions: 95.89,
        branches: 95.04,
        statements: 97.58,
        autoUpdate: true,
      },
    },
  },
});
