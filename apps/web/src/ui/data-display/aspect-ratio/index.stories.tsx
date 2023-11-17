import Image from 'next/image';
import type { Meta, StoryObj } from '@storybook/react';

import { AspectRatio } from '.';

const meta = {
  title: 'Data Display / Aspect Ratio',
  component: AspectRatio,
  args: {
    children: (
      <Image
        src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
        alt='Photo by Drew Beamer'
        fill
        className='rounded-md object-cover'
      />
    ),
  },
  argTypes: {
    ratio: {
      control: 'number',
      description: 'The desired ratio (ex. `16 / 9`).',
      table: {
        defaultValue: { summary: 1 },
        type: { summary: 'number' },
      },
    },
    asChild: {
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
  decorators: [
    (Story) => (
      <div className='w-[400px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
};
