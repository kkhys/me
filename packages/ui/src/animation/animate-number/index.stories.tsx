import { AnimateNumber } from "@kkhys/ui/animate-number";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Animation / AnimateNumber",
  component: AnimateNumber,
  argTypes: {
    count: {
      control: { type: "number" },
      description: "The value to animate to.",
      defaultValue: 0,
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof AnimateNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    count: 100,
  },
} satisfies Story;
