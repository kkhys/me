import { default as NextLink } from 'next/link';
import { ChevronRightIcon, EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

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

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

export const Icon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    'aria-label': 'Next',
    children: <ChevronRightIcon className='h-4 w-4' />,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <EnvelopeOpenIcon className='mr-2 h-4 w-4' /> Login with Email
      </>
    ),
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
        Please wait
      </>
    ),
  },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <NextLink href='/?path=/story/general-button--as-child'>Login</NextLink>,
  },
};
