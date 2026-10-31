import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.ts"],
      // Orchestrates git and the GitHub API end to end; only testable by
      // mocking both, so coverage tracks the pure modules it composes.
      exclude: ["src/index.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
        autoUpdate: true,
      },
    },
  },
});
