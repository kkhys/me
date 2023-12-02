import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarFallback, AvatarImage } from '.';

const meta = {
  title: 'Data Display / Avatar',
  component: Avatar,
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
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <AvatarImage src='https://github.com/kkhys.png' alt='@kkhys' />
        <AvatarFallback>KK</AvatarFallback>
      </>
    ),
  },
} satisfies Story;
