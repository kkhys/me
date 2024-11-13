import type { Meta, StoryObj } from '@storybook/react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '.';
import { Button, Input, Label } from '../../';

const meta = {
  title: 'Feedback / Sheet',
  component: Sheet,
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description:
        'The controlled open state of the dialog. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      action: 'changed',
      description:
        'Event handler called when the open state of the dialog changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    modal: {
      control: 'boolean',
      description:
        'The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <SheetTrigger asChild>
          <Button variant='outline'>Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input id='name' value='Pedro Duarte' className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Username
              </Label>
              <Input id='username' value='@peduarte' className='col-span-3' />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type='submit'>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </>
    ),
  },
} satisfies Story;

const SideDemo = () => {
  const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

  return (
    <div className='grid grid-cols-2 gap-2'>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant='outline'>{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input id='name' value='Pedro Duarte' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='username' className='text-right'>
                  Username
                </Label>
                <Input id='username' value='@peduarte' className='col-span-3' />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type='submit'>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
};

export const Side = {
  render: () => <SideDemo />,
} satisfies Story;
