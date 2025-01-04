import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import "#/styles/globals.css";
import { TooltipProvider, cn } from "@kkhys/ui";
import { inter, jetBrainsMono, newsreader, notoSansJP } from "#/lib/font";

const preview = {
  parameters: {
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
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            "mx-auto w-full max-w-6xl",
            notoSansJP.className,
            inter.variable,
            newsreader.variable,
            jetBrainsMono.variable,
          )}
        >
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Preview;

export default preview;
