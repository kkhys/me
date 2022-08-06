import React from 'react';
import { IconBag } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Icon',
  component: IconBag,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof IconBag>;

const Template: ComponentStory<typeof IconBag> = (args) => (
  <IconBag {...args} />
);

export const Default = Template.bind({});
Default.args = {};
