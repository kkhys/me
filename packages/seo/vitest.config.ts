import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 83.33,
        statements: 100,
        autoUpdate: true,
      },
    },
  },
});
