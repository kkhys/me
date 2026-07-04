import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      include: ["src/memo-store.ts", "src/memo-filter.ts", "src/request-guard.ts"],
    },
  },
});
