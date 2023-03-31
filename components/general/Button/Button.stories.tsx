import { RocketLaunchIcon } from '@heroicons/react/24/outline';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '#/components/general';

const meta: Meta<typeof Button> = {
  title: 'Components/General/Button',
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
  },
};

export const WithStartIcon: Story = {
  args: {
    children: 'Button',
    startIcon: <RocketLaunchIcon className='h-4 w-4' />,
  },
};

export const WithEndIcon: Story = {
  args: {
    children: 'Button',
    endIcon: <RocketLaunchIcon className='h-4 w-4' />,
  },
};
