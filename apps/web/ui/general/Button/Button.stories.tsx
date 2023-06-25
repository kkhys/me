import type { Meta, StoryObj } from '@storybook/react';

import { Button, MoonIcon } from '#/ui';

const meta: Meta<typeof Button> = {
  title: 'General/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};
