import React from 'react';
import { Text } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Text',
  component: Text,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = (args) => (
  <Text {...args}>Sample</Text>
);

export const Default = Template.bind({});
Default.args = {
  width: 'narrow',
};
