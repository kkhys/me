import type { Meta, StoryObj } from '@storybook/react';

import { AspectRatio } from '.';

const meta = {
  title: 'Data Display / Aspect Ratio',
  component: AspectRatio,
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
    ratio: {
      control: 'number',
      description: 'The desired ratio (ex. `16 / 9`).',
      table: {
        defaultValue: { summary: 1 },
        type: { summary: 'number' },
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    ratio: 16 / 9,
    children: (
      <img
        src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
        alt='Drew Beamer'
        className='rounded-md object-cover'
      />
    ),
  },
  decorators: [
    (Story) => (
      <div className='w-[400px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Story;
