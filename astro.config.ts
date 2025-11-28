import { defineConfig, envField } from "astro/config";

export default defineConfig({
  site: "https://lgtm.kkhys.me",
  env: {
    schema: {
      NODE_ENV: envField.enum({
        context: "client",
        access: "public",
        values: ["development", "production"],
      }),
    },
  },
});
