import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

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
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
} satisfies StorybookConfig;

export default config;
