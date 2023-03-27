import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '#/components/general';

const meta: Meta<typeof Button> = {
  title: 'Components/General/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    type: '',
  },
};
