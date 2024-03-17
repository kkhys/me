import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Progress } from '.';

const meta = {
  title: 'Feedback / Progress',
  component: Progress,
  argTypes: {
    asChild: {
      control: 'boolean',
      description:
        'Change the default rendered element for the one passed as a child, merging their props and behavior.\n\nRead our <a href="https://www.radix-ui.com/primitives/docs/guides/composition" target="_blank" rel="noreferrer noopener">Composition</a> guide for more details.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    value: {
      control: 'number',
      description: 'The progress value.',
      table: {
        type: { summary: 'enum', detail: 'number | null' },
      },
      type: {
        name: 'enum',
        value: ['number', 'null'],
      },
    },
    max: {
      control: 'number',
      description: 'The maximum progress value.',
      table: {
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    getValueLabel: {
      description:
        'A function to get the accessible label text representing the current value in a human-readable format. If not provided, the value label will be read as the numeric value as a percentage of the max value.',
      table: {
        type: { summary: 'function', detail: '(value: number, max: number) => string' },
      },
      type: {
        name: 'function',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultDemo = () => {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className='w-[350px]' />;
};

export const Default = {
  render: () => <DefaultDemo />,
} satisfies Story;
