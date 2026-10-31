import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      include: [
        "src/memo-store.ts",
        "src/memo-filter.ts",
        "src/memo-format.ts",
        "src/request-guard.ts",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 97.33,
        statements: 98.52,
        autoUpdate: true,
      },
    },
  },
});
