import { ChevronRightIcon, EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './index';

const meta = {
  title: 'general/button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Button',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Button',
    variant: 'link',
  },
};

export const Icon: Story = {
  args: {
    children: <ChevronRightIcon className='h-4 w-4' />,
    variant: 'outline',
    size: 'icon',
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
    children: (
      <>
        <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
        Please wait
      </>
    ),
    disabled: true,
  },
};

export const AsChild: Story = {
  args: {
    // TODO: use next/link
    children: <a href='/#'>Button</a>,
    asChild: true,
  },
};
