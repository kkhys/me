import * as React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '#/ui/general';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '.';

const meta = {
  title: 'Data Display / Collapsible',
  component: Collapsible,
  argTypes: {
    asChild: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

const CollapsibleWithHooks = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-[350px] space-y-2'>
      <div className='flex items-center justify-between space-x-4 px-4'>
        <h4 className='text-sm font-semibold'>@kkhys starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='sm'>
            <CaretSortIcon className='h-4 w-4' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm'>@radix-ui/primitives</div>
      <CollapsibleContent className='space-y-2'>
        <div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm'>@radix-ui/colors</div>
        <div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm'>@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const Default: Story = {
  render: () => <CollapsibleWithHooks />,
};
