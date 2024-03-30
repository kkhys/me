import type { Meta, StoryObj } from '@storybook/react';

import { Separator } from '.';

const meta = {
  title: 'Layout / Separator',
  component: Separator,
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
    orientation: {
      control: 'radio',
      description: 'The orientation of the separator.',
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: { summary: 'horizontal' },
        type: { summary: 'enum', detail: '"horizontal" | "vertical"' },
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical'],
      },
    },
    decorative: {
      control: 'boolean',
      description:
        'When `true`, signifies that it is purely visual, carries no semantic meaning, and ensures it is not present in the accessibility tree.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <div>
      <div className='space-y-1'>
        <h4 className='text-sm font-medium leading-none'>Radix Primitives</h4>
        <p className='text-sm text-muted-foreground'>An open-source UI component library.</p>
      </div>
      <Separator className='my-4' />
      <div className='flex h-5 items-center space-x-4 text-sm'>
        <div>Blog</div>
        <Separator orientation='vertical' />
        <div>Docs</div>
        <Separator orientation='vertical' />
        <div>Source</div>
      </div>
    </div>
  ),
} satisfies Story;
