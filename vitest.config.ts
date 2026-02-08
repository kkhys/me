import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.SITE": JSON.stringify("https://example.com"),
  },
  test: {
    coverage: {
      include: ["src/utils/*.ts", "src/lib/*.ts", "src/lib/api/*.ts"],
      exclude: [
        "src/lib/expressive-code.ts",
        "src/lib/rehype-mermaid-options.ts",
      ],
    },
  },
});
