import React from 'react';
import { IconMenu } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Icon',
  component: IconMenu,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof IconMenu>;

const Template: ComponentStory<typeof IconMenu> = (args) => (
  <IconMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {};
