import type { Meta, StoryObj } from '@storybook/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '.';

const AccordionItems = () => (
  <>
    <AccordionItem value='item-1'>
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </AccordionItem>
    <AccordionItem value='item-2'>
      <AccordionTrigger>Is it unstyled?</AccordionTrigger>
      <AccordionContent>
        Yes. It&apos;s unstyled by default, giving you freedom over the look and feel.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value='item-3'>
      <AccordionTrigger>Can it be animated?</AccordionTrigger>
      <AccordionContent>Yes! You can animate the Accordion with CSS or JavaScript.</AccordionContent>
    </AccordionItem>
  </>
);

const meta = {
  title: 'Data Display / Accordion',
  component: Accordion,
  args: {
    className: 'w-[450px]',
    children: <AccordionItems />,
  },
  argTypes: {
    type: {
      control: 'radio',
      description: 'Determines whether one or multiple items can be opened at the same time.',
      options: ['single', 'multiple'],
      table: {
        type: { summary: 'enum', detail: '"single" | "multiple"' },
      },
      type: {
        name: 'enum',
        value: ['single', 'multiple'],
        required: true,
      },
    },
    collapsible: {
      if: { arg: 'type', eq: 'single' },
      control: 'boolean',
      description: 'When `type` is `"single"`, allows closing content when clicking trigger for an open item.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    defaultValue: {
      if: { arg: 'type', eq: 'single' },
      control: 'radio',
      description:
        'The value of the item to expand when initially rendered and `type` is `"single"`. Use when you do not need to control the state of the items.',
      options: ['item-1', 'item-2', 'item-3'],
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
  },
};

export const DefaultOpen: Story = {
  args: {
    type: 'single',
    defaultValue: 'item-2',
  },
};

export const Collapsible: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
};
