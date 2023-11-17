import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '.';

const meta = {
  title: 'Data Display / Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'radio',
      description: 'The badge variant.',
      options: ['default', 'secondary', 'outline', 'destructive'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "secondary" | "outline" | "destructive"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'secondary', 'outline', 'destructive'],
      },
    },
    children: {
      control: 'text',
      description: 'The badge content.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};
