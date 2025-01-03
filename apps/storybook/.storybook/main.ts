import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, "package.json")));

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  refs: (_, { configType }) => {
    if (configType === "DEVELOPMENT") {
      return {
        ui: {
          title: "UI",
          url: "http://localhost:6007/",
        },
        web: {
          title: "Web",
          url: "http://localhost:6008/",
        },
      };
    }
    return {
      ui: {
        title: "UI",
        url: "ui/",
      },
      web: {
        title: "Web",
        url: "web/",
      },
    };
  },
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
} satisfies StorybookConfig;

export default config;
