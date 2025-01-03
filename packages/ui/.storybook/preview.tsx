import type { Preview } from "@storybook/react";

import "@kkhys/ui/index.css";
import { withThemeByClassName } from "@storybook/addon-themes";

const preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
  },
  tags: ["autodocs"],
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
} satisfies Preview;

export default preview;
