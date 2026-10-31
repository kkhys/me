import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    exclude: ["node_modules", ".direnv", "dist", "vrt"],
    coverage: {
      include: ["src/utils/*.ts"],
      thresholds: {
        lines: 95.36,
        functions: 91.89,
        branches: 88.54,
        statements: 92.89,
        autoUpdate: true,
      },
    },
  },
});
