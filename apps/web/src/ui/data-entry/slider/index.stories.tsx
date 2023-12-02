import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from '.';

const meta = {
  title: 'Data Entry / Slider',
  component: Slider,
  argTypes: {
    asChild: {
      control: 'boolean',
      description:
        'Change the default rendered element for the one passed as a child, merging their props and behavior.\n\nRead our <a href="https://www.radix-ui.com/primitives/docs/guides/composition" target="_blank" rel="noreferrer noopener">Composition</a> guide for more details.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    defaultValue: {
      control: 'object',
      description:
        'The value of the slider when initially rendered. Use when you do not need to control the state of the slider.',
      table: {
        type: { summary: 'number[]' },
      },
      type: {
        name: 'array',
        value: {
          name: 'number',
        },
      },
    },
    value: {
      control: 'object',
      description: 'The controlled value of the slider. Must be used in conjunction with `onValueChange`.',
      table: {
        type: { summary: 'number[]' },
      },
      type: {
        name: 'array',
        value: {
          name: 'number',
        },
      },
    },
    onValueChange: {
      action: 'changed',
      description: 'Event handler called when the value changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(value: number[]) => void' },
      },
      type: {
        name: 'function',
      },
    },
    onValueCommit: {
      action: 'committed',
      description:
        'Event handler called when the value changes at the end of an interaction. Useful when you only need to capture a final value e.g. to update a backend service.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(value: number[]) => void' },
      },
      type: {
        name: 'function',
      },
    },
    name: {
      control: 'text',
      description: 'The name of the slider. Submitted with its owning form as part of a name/value pair.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with the slider.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    orientation: {
      control: 'radio',
      description: 'The orientation of the slider.',
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: { summary: 'horizontal' },
        type: { summary: 'enum', detail: '"horizontal" | "vertical"' },
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
    },
    dir: {
      control: 'radio',
      description:
        'The reading direction of the slider. If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.',
      options: ['ltr', 'rtl'],
      table: {
        type: { summary: 'enum', detail: '"ltr" | "rtl"' },
      },
      type: {
        name: 'enum',
        value: ['ltr', 'rtl'],
      },
    },
    inverted: {
      control: 'boolean',
      description: 'Whether the slider is visually inverted.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    min: {
      control: 'number',
      description: 'The minimum value for the range.',
      table: {
        defaultValue: { summary: 0 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    max: {
      control: 'number',
      description: 'The maximum value for the range.',
      table: {
        defaultValue: { summary: 100 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    step: {
      control: 'number',
      description: 'The stepping interval.',
      table: {
        defaultValue: { summary: 1 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    minStepsBetweenThumbs: {
      control: 'number',
      description: 'The minimum permitted steps between multiple thumbs.',
      table: {
        defaultValue: { summary: 0 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    className: 'w-[280px]',
  },
} satisfies Story;
