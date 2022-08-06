import React from 'react';
import { Header2 } from '^/index';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Example/Header',
  component: Header2,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Header2>;

const Template: ComponentStory<typeof Header2> = (args) => (
  <Header2 {...args} />
);

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    name: 'Jane Doe',
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
