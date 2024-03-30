import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRightIcon, EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons';

import { Button } from '.';

const meta = {
  title: 'General / Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'radio',
      description: 'The button variant.',
      options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      },
    },
    size: {
      control: 'radio',
      description: 'The button size.',
      options: ['default', 'sm', 'lg', 'icon'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "sm" | "lg" | "icon"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'sm', 'lg', 'icon'],
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
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
    children: {
      control: 'text',
      description: 'The button content.',
      table: {
        type: { summary: 'enum', detail: '"string" | "ReactNode"' },
      },
      type: {
        name: 'enum',
        value: ['string', 'ReactNode'],
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: 'Button',
  },
} satisfies Story;

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
} satisfies Story;

export const Link = {
  args: {
    variant: 'link',
    children: 'Link',
  },
} satisfies Story;

export const Icon = {
  args: {
    variant: 'outline',
    size: 'icon',
    'aria-label': 'Next',
    children: <ChevronRightIcon className='size-4' />,
  },
} satisfies Story;

export const WithIcon = {
  args: {
    children: (
      <>
        <EnvelopeOpenIcon className='mr-2 size-4' /> Login with Email
      </>
    ),
  },
} satisfies Story;

export const Loading = {
  args: {
    disabled: true,
    children: (
      <>
        <ReloadIcon className='mr-2 size-4 animate-spin' />
        Please wait
      </>
    ),
  },
} satisfies Story;

export const AsChild = {
  args: {
    asChild: true,
    children: <a href='/?path=/story/general-button--as-child'>Login</a>,
  },
} satisfies Story;
