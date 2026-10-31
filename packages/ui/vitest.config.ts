import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      thresholds: {
        lines: 88.42,
        functions: 86.27,
        branches: 82.47,
        statements: 86.5,
        autoUpdate: true,
      },
    },
  },
});
