import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from '.';

const meta = {
  title: 'Feedback / Skeleton',
  component: Skeleton,
  argTypes: {
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <div className='flex items-center space-x-4'>
      <Skeleton className='size-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  ),
} satisfies Story;
