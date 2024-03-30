import type { Meta, StoryObj } from '@storybook/react';

import { Layout } from '.';

const meta = {
  title: 'Feature / Global / Layout',
  component: Layout,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: <></>,
  },
} satisfies Story;
