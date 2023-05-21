import type { Meta, StoryObj } from '@storybook/react';

import { Spin } from '#/feedback';

const meta: Meta<typeof Spin> = {
  title: 'Feedback/Spin',
  component: Spin,
};

export default meta;

type Story = StoryObj<typeof Spin>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
  },
};
