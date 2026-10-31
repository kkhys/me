import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      thresholds: {
        lines: 58.64,
        functions: 45.94,
        branches: 59.85,
        statements: 57.69,
        autoUpdate: true,
      },
    },
  },
});
