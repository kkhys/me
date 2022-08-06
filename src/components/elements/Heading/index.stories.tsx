import React from 'react';
import { Heading } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Heading',
  component: Heading,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Heading>;

const Template: ComponentStory<typeof Heading> = (args) => (
  <Heading {...args}>Sample</Heading>
);

export const Default = Template.bind({});
Default.args = {
  width: 'default',
};
