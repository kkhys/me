import type { Meta, StoryObj } from '@storybook/react';

import { Popover, PopoverContent, PopoverTrigger } from '.';
import { Button, Input, Label } from '../../';

const meta = {
  title: 'Data Display / Popover',
  component: Popover,
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the popover when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description:
        'The controlled open state of the popover. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      action: 'changed',
      description:
        'Event handler called when the open state of the popover changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    modal: {
      control: 'boolean',
      description:
        'The modality of the popover. When set to `true`, interaction with outside elements will be disabled and only popover content will be visible to screen readers.',
      table: {
        defaultValue: { summary: false },
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
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <PopoverTrigger asChild>
          <Button variant='outline'>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <h4 className='font-medium leading-none'>Dimensions</h4>
              <p className='text-sm text-muted-foreground'>
                Set the dimensions for the layer.
              </p>
            </div>
            <div className='grid gap-2'>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='width'>Width</Label>
                <Input
                  id='width'
                  defaultValue='100%'
                  className='col-span-2 h-8'
                />
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='maxWidth'>Max. width</Label>
                <Input
                  id='maxWidth'
                  defaultValue='300px'
                  className='col-span-2 h-8'
                />
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='height'>Height</Label>
                <Input
                  id='height'
                  defaultValue='25px'
                  className='col-span-2 h-8'
                />
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='maxHeight'>Max. height</Label>
                <Input
                  id='maxHeight'
                  defaultValue='none'
                  className='col-span-2 h-8'
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </>
    ),
  },
} satisfies Story;
