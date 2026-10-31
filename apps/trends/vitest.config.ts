import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    exclude: ["node_modules", ".direnv", "dist"],
    coverage: {
      include: ["src/utils/*.ts", "src/features/**/*.ts"],
      thresholds: {
        lines: 72.69,
        functions: 78.32,
        branches: 74.11,
        statements: 72.5,
        autoUpdate: true,
      },
    },
  },
});
