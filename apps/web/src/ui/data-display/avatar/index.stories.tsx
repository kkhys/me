import type { Meta, StoryObj } from '@storybook/react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/ui/data-display';
import { Avatar, AvatarFallback, AvatarImage } from '.';

const meta = {
  title: 'Data Display / Avatar',
  component: Avatar,
  args: {
    children: (
      <>
        <AvatarImage src='https://github.com/kkhys.png' alt='@kkhys' />
        <AvatarFallback>KK</AvatarFallback>
      </>
    ),
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    asChild: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTooltip: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Story />
          </TooltipTrigger>
          <TooltipContent side='top'>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  ],
};
