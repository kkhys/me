import React from 'react';
import { Button } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Text',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>Sample</Button>
);

export const Default = Template.bind({});
Default.args = {
  variant: 'primary',
};
