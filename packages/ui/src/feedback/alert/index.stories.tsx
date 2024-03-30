import type { Meta, StoryObj } from '@storybook/react';
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '.';

const meta = {
  title: 'Feedback / Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'radio',
      description: 'The visual variant to be applied to the Alert.',
      options: ['default', 'destructive'],
      table: {
        type: { summary: 'enum', detail: '"default" | "destructive"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'destructive'],
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default = {
  args: {
    children: (
      <>
        <RocketIcon className='size-4' />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </>
    ),
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <ExclamationTriangleIcon className='size-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </>
    ),
  },
} satisfies Story;
