import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '.';
import { Button } from '../../general';

const meta = {
  title: 'Data Display / Collapsible',
  component: Collapsible,
  argTypes: {
    asChild: {
      control: 'boolean',
      description:
        'Change the default rendered element for the one passed as a child, merging their props and behavior.\n\nRead our <a href="https://www.radix-ui.com/primitives/docs/guides/composition" target="_blank" rel="noreferrer noopener">Composition</a> guide for more details.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the collapsible when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the collapsible. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      action: 'changed',
      description: 'Event handler called when the open state of the collapsible changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with the collapsible.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    className: 'w-[350px] space-y-2',
    children: (
      <>
        <div className='flex items-center justify-between space-x-4 px-4'>
          <h4 className='text-sm font-medium'>@kkhys starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm'>
              <CaretSortIcon className='size-4' />
              <span className='sr-only'>Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm'>@radix-ui/primitives</div>
        <CollapsibleContent className='space-y-2'>
          <div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm'>@radix-ui/colors</div>
          <div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm'>@stitches/react</div>
        </CollapsibleContent>
      </>
    ),
  },
} satisfies Story;
