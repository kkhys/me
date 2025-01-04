import { dirname, join, resolve } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";
import { env } from "#/env";

const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, "package.json")));

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  staticDirs: ["../public"],
  features: {
    experimentalRSC: true,
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve?.alias,
      "contentlayer/generated": resolve(
        __dirname,
        "..",
        ".contentlayer",
        "generated",
      ),
    };
    return config;
  },
  env: (envConfig) => ({
    ...envConfig,
    ...env,
  }),
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
} satisfies StorybookConfig;

export default config;
