import type { Meta } from '@storybook/react';

import { FormDemo } from '#/ui/data-entry/input/index.stories';
import { ToastDecorator } from '#/ui/feedback';
import { Form } from '.';

const meta = {
  title: 'Data Entry / Form',
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = Meta<typeof Form>;

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
