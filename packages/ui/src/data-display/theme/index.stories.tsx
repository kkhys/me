import { ModeSwitcher } from "@kkhys/ui/theme";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "next-themes";

const meta = {
  title: "Data Display / Theme",
  component: ModeSwitcher,
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ModeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
