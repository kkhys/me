import React from 'react';
import { Section } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Section',
  component: Section,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Section>;

const Template: ComponentStory<typeof Section> = (args) => (
  <Section {...args}>Sample</Section>
);

export const Default = Template.bind({});
Default.args = {
  heading: 'heading',
};
