import type { Meta, StoryObj } from "@storybook/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kkhys/ui";
import { fn } from "@storybook/test";

const meta = {
  title: "Data Display / Accordion",
  component: Accordion,
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
    type: {
      control: "radio",
      description:
        "Determines whether one or multiple items can be opened at the same time.",
      options: ["single", "multiple"],
      table: {
        type: { summary: "enum", detail: '"single" | "multiple"' },
      },
      type: {
        name: "enum",
        value: ["single", "multiple"],
        required: true,
      },
    },
    value: {
      if: { arg: "type", eq: "single" },
      control: "radio",
      description:
        'The controlled value of the item to expand when `type` is `"single"`. Must be used in conjunction with `onValueChange`.',
      options: ["item-1", "item-2", "item-3"],
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    defaultValue: {
      if: { arg: "type", eq: "single" },
      control: "radio",
      description:
        'The value of the item to expand when initially rendered and `type` is `"single"`. Use when you do not need to control the state of the items.',
      options: ["item-1", "item-2", "item-3"],
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    onValueChange: {
      if: { arg: "type", eq: "single" },
      action: "changed",
      description:
        'Event handler called when the expanded state of an item changes and `type` is `"single"`.',
      table: {
        category: "Events",
        type: { summary: "function", detail: "(value: string) => void" },
      },
      type: {
        name: "function",
      },
    },
    collapsible: {
      if: { arg: "type", eq: "single" },
      control: "boolean",
      description:
        'When `type` is `"single"`, allows closing content when clicking trigger for an open item.',
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    disabled: {
      control: "boolean",
      description:
        "When `true`, prevents the user from interacting with the accordion and all its items.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    dir: {
      control: "radio",
      description:
        "The reading direction of the accordion when applicable. If omitted, assumes LTR (left-to-right) reading mode.",
      options: ["ltr", "rtl"],
      table: {
        defaultValue: { summary: "ltr" },
        type: { summary: "enum", detail: '"ltr" | "rtl"' },
      },
      type: {
        name: "enum",
        value: ["ltr", "rtl"],
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    type: "single",
    className: "w-[450px]",
    children: (
      <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it unstyled?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s unstyled by default, giving you freedom over the look
            and feel.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can it be animated?</AccordionTrigger>
          <AccordionContent>
            Yes! You can animate the Accordion with CSS or JavaScript.
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
} satisfies Story;
