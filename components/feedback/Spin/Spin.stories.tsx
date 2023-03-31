import type { Meta, StoryObj } from '@storybook/react';

import { Spin } from '#/components/feedback';

const meta: Meta<typeof Spin> = {
  title: 'Components/Feedback/Spin',
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
