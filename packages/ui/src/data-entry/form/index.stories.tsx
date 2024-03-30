import type { Meta, StoryObj } from '@storybook/react';

import { Form } from '.';
import { ToastDecorator } from '../../';
import { FormDemo } from '../input/index.stories';

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
