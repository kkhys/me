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
      include: [
        "src/components/lgtm-image.tsx",
        "src/pages/[id]-[size]-[format].ts",
        "src/pages/[id].[format].ts",
      ],
    },
  },
});
