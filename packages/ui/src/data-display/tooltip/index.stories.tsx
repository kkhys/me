import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '#/general';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '.';

const meta = {
  title: 'Data Display / Tooltip',
  component: Tooltip,
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the tooltip. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      action: 'changed',
      description: 'Event handler called when the open state of the tooltip changes.',
      table: {
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    delayDuration: {
      control: 'number',
      description: 'Override the duration given to the `Provider` to customise the open delay for a specific tooltip.',
      table: {
        defaultValue: { summary: '700' },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    disableHoverableContent: {
      control: 'boolean',
      description:
        'Prevents `TooltipContent` from remaining open when hovering. Disabling this has accessibility consequences. Inherits from `TooltipProvider`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <TooltipTrigger asChild>
          <Button variant='outline'>Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 200,
      },
    },
  },
} satisfies Story;
