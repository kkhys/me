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
      include: ["src/utils/*.ts", "src/lib/*.ts"],
      exclude: ["src/utils/image.ts"],
    },
  },
});
