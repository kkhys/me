import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      include: ["src/utils/*.ts", "src/lib/*.ts"],
      exclude: [
        "src/utils/image.ts",
      ],
    },
  },
});
