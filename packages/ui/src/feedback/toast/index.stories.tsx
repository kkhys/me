import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { Component } from 'react';

import { toast, Toaster } from '.';
import { Button } from '../../';

export const ToastDecorator: Decorator = (Story) => (
  <>
    <Story />
    <Toaster />
  </>
);

const meta = {
  title: 'Feedback / Toast',
  component: Component,
  excludeStories: ['ToastDecorator'],
  decorators: [ToastDecorator],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <Button
      variant='outline'
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }
    >
      Show Toast
    </Button>
  ),
} satisfies Story;
