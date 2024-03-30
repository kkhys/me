import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@kkhys/ui';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/ui/data-display';
import { Input, Label } from '#/ui/data-entry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '.';

const meta = {
  title: 'Data Display / Tabs',
  component: Tabs,
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
    defaultValue: {
      control: 'radio',
      description:
        'The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs.',
      options: ['account', 'password'],
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    value: {
      control: 'radio',
      description: 'The controlled value of the tab to activate. Should be used in conjunction with `onValueChange`.',
      options: ['account', 'password'],
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    onValueChange: {
      action: 'changed',
      description: 'Event handler called when the value changes.',
      table: {
        type: { summary: 'function', detail: '(value: string) => void' },
      },
      type: {
        name: 'function',
      },
    },
    orientation: {
      control: 'radio',
      description: 'The orientation of the component.',
      options: ['horizontal', 'vertical', 'undefined'],
      table: {
        defaultValue: { summary: 'horizontal' },
        type: { summary: 'enum', detail: '"horizontal" | "vertical" | "undefined"' },
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical', 'undefined'],
      },
    },
    dir: {
      control: 'radio',
      description:
        'The reading direction of the tabs. If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.',
      options: ['ltr', 'rtl'],
      table: {
        type: { summary: 'enum', detail: '"ltr" | "rtl"' },
      },
      type: {
        name: 'enum',
        value: ['ltr', 'rtl'],
      },
    },
    activationMode: {
      control: 'radio',
      description:
        'When `automatic`, tabs are activated when receiving focus. When `manual`, tabs are activated when clicked.',
      options: ['automatic', 'manual'],
      table: {
        defaultValue: { summary: 'automatic' },
        type: { summary: 'enum', detail: '"automatic" | "manual"' },
      },
      type: {
        name: 'enum',
        value: ['automatic', 'manual'],
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    defaultValue: 'account',
    className: 'w-[400px]',
    children: (
      <>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' defaultValue='Pedro Duarte' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' defaultValue='@peduarte' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value='password'>
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='current'>Current password</Label>
                <Input id='current' type='password' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='new'>New password</Label>
                <Input id='new' type='password' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </>
    ),
  },
} satisfies Story;
