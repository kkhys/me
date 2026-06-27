import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // lgtm-image.test.tsx imports the Satori .tsx pipeline. Astro's tsconfig sets
  // jsx: "preserve", which Vite 8 leaves untransformed in tests; the React
  // plugin transforms the JSX (automatic runtime) so the module can load.
  plugins: [react()],
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/.direnv/**"],
    coverage: {
      include: [
        "src/components/lgtm-image.tsx",
        "src/pages/[id]-[size].[format].ts",
        "src/pages/[id].[format].ts",
        "src/pages/api/ids.json.ts",
      ],
    },
  },
});
