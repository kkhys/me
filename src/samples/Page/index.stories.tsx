/* eslint-disable @typescript-eslint/await-thenable */
import { within, userEvent } from '@storybook/testing-library';
import React from 'react';
import { Page2 } from '^/index';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Example/Page',
  component: Page2,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Page2>;

const Template: ComponentStory<typeof Page2> = (args) => <Page2 {...args} />;

export const LoggedOut = Template.bind({});

export const LoggedIn = Template.bind({});

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
LoggedIn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const loginButton = await canvas.getByRole('button', { name: /Log in/i });
  await userEvent.click(loginButton);
};
