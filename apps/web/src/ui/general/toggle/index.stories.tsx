import type { Meta, StoryObj } from '@storybook/react';
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';

import { Toggle } from '.';

const meta = {
  title: 'General / Toggle',
  component: Toggle,
  argTypes: {
    variant: {
      control: 'radio',
      description: 'The visual variant to use for the toggle.',
      options: ['default', 'outline'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "outline"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'outline'],
      },
    },
    size: {
      control: 'radio',
      description: 'The size of the toggle.',
      options: ['default', 'sm', 'lg'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "sm" | "lg"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'sm', 'lg'],
      },
    },
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
    defaultPressed: {
      control: 'boolean',
      description:
        'The pressed state of the toggle when it is initially rendered. Use when you do not need to control its pressed state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    pressed: {
      control: 'boolean',
      description: 'The controlled pressed state of the toggle. Must be used in conjunction with `onPressedChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onPressedChange: {
      action: 'pressed',
      description: 'Event handler called when the pressed state of the toggle changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(pressed: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with the toggle.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    'aria-label': {
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
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    'aria-label': 'Default',
    children: <FontBoldIcon className='size-4' />,
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: 'outline',
    'aria-label': 'Outline',
    children: <FontItalicIcon className='size-4' />,
  },
} satisfies Story;

export const WithText = {
  args: {
    'aria-label': 'With text',
    children: (
      <>
        <FontItalicIcon className='mr-2 size-4' />
        Italic
      </>
    ),
  },
} satisfies Story;

export const Small = {
  args: {
    size: 'sm',
    'aria-label': 'Small',
    children: <FontItalicIcon className='size-4' />,
  },
} satisfies Story;

export const Large = {
  args: {
    size: 'lg',
    'aria-label': 'Large',
    children: <FontItalicIcon className='size-4' />,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    'aria-label': 'Disabled',
    children: <UnderlineIcon className='size-4' />,
  },
} satisfies Story;
