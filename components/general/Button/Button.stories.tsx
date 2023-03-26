import type { ButtonProps } from '#/components/general';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '#/components/general';

const meta: Meta<ButtonProps> = {
  title: 'Components/General/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    type: '',
  },
};
