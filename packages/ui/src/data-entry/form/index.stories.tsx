import type { Meta, StoryObj } from '@storybook/react';

import { FormDemo } from '#/data-entry/input/index.stories';
import { ToastDecorator } from '#/feedback';
import { Form } from '.';

const meta = {
  title: 'Data Entry / Form',
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof Form>;

export const Default = {
  render: () => <FormDemo />,
  decorators: [ToastDecorator],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
} satisfies Story;
