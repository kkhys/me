import type { Meta, StoryObj } from '@storybook/react';
import { CalendarIcon } from '@radix-ui/react-icons';

import { Avatar, AvatarFallback, AvatarImage } from '#/ui/data-display';
import { Button } from '#/ui/general';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '.';

const meta = {
  title: 'Data Display / HoverCard',
  component: HoverCard,
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the hover card when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the hover card. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      action: 'changed',
      description: 'Event handler called when the open state of the hover card changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    openDelay: {
      control: 'number',
      description: 'The duration from when the mouse enters the trigger until the hover card opens.',
      table: {
        defaultValue: { summary: 700 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    closeDelay: {
      control: 'number',
      description: 'The duration from when the mouse leaves the trigger or content until the hover card closes.',
      table: {
        defaultValue: { summary: 300 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <HoverCardTrigger asChild>
          <Button variant='link'>@nextjs</Button>
        </HoverCardTrigger>
        <HoverCardContent className='w-80'>
          <div className='flex justify-between space-x-4'>
            <Avatar>
              <AvatarImage src='https://github.com/vercel.png' />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <h4 className='text-sm font-medium'>@nextjs</h4>
              <p className='text-sm'>The React Framework – created and maintained by @vercel.</p>
              <div className='flex items-center pt-2'>
                <CalendarIcon className='mr-2 size-4 opacity-70' />{' '}
                <span className='text-xs text-muted-foreground'>Joined December 2021</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </>
    ),
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 350,
      },
    },
  },
} satisfies Story;
