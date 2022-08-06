import React from 'react';
import { Grid, Text } from '^/elements';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Element/Grid',
  component: Grid,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Grid>;

const Template: ComponentStory<typeof Grid> = (args) => (
  <Grid {...args}>
    <Text>item 1</Text>
    <Text>item 2</Text>
    <Text>item 3</Text>
  </Grid>
);

export const Default = Template.bind({});
Default.args = {
  number: 3,
};
