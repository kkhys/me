import type { Meta, StoryObj } from '@storybook/react';

import { ModeToggle } from '.';

const meta = {
  title: 'Feature / Mode Toggle',
  component: ModeToggle,
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
