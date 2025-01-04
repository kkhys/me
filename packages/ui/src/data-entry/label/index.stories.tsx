import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox, Label } from "@kkhys/ui";

const meta = {
  title: "Data Entry / Label",
  component: Label,
  argTypes: {
    asChild: {
      control: "boolean",
      description:
        'Change the default rendered element for the one passed as a child, merging their props and behavior.\n\nRead our <a href="https://www.radix-ui.com/primitives/docs/guides/composition" target="_blank" rel="noreferrer noopener">Composition</a> guide for more details.',
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    htmlFor: {
      control: "text",
      description: "The id of the element the label is associated with.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: "Accept terms and conditions",
    htmlFor: "default-checkbox",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center space-x-2">
        <Checkbox
          id="default-checkbox"
          aria-label="Accept terms and conditions"
        />
        <Story />
      </div>
    ),
  ],
} satisfies Story;
