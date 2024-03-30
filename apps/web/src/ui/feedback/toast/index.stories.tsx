import type { PartialStoryFn } from '@storybook/csf';
import type { Meta, ReactRenderer, StoryObj } from '@storybook/react';
import { Component } from 'react';

import { Button } from '@kkhys/ui';

import { toast, Toaster } from '.';

export const ToastDecorator = (Story: PartialStoryFn<ReactRenderer>) => (
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
