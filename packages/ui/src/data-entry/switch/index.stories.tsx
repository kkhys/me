import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Switch } from '.';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Label,
  toast,
  ToastDecorator,
} from '../../';

const meta = {
  title: 'Data Entry / Switch',
  component: Switch,
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
    defaultChecked: {
      control: 'boolean',
      description:
        'The state of the switch when it is initially rendered. Use when you do not need to control its state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    checked: {
      control: 'boolean',
      description: 'The controlled state of the switch. Must be used in conjunction with `onCheckedChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onCheckedChange: {
      action: 'changed',
      description: 'Event handler called when the state of the switch changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(checked: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with the switch.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    required: {
      control: 'boolean',
      description:
        'When `true`, indicates that the user must check the switch before the owning form can be submitted.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    name: {
      control: 'text',
      description: 'The name of the switch. Submitted with its owning form as part of a name/value pair.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    value: {
      control: 'text',
      description: 'The value given as data when submitted with a name.',
      table: {
        defaultValue: { summary: 'on' },
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
    'aria-label': {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    id: 'default-switch',
    'aria-label': 'Airplane Mode',
  },
  decorators: [
    (Story) => (
      <div className='flex items-center space-x-2'>
        <Story />
        <Label htmlFor='default-switch'>Airplane Mode</Label>
      </div>
    ),
  ],
} satisfies Story;

const FormDemo = () => {
  const FormSchema = z.object({
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      security_emails: true,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-[500px] space-y-6'>
        <div>
          <h3 className='mb-4 text-lg font-medium'>Email Notifications</h3>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='marketing_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Marketing emails</FormLabel>
                    <FormDescription>Receive emails about new products, features, and more.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='security_emails'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Security emails</FormLabel>
                    <FormDescription>Receive emails about your account security.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled aria-readonly />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export const FormStory = {
  name: 'Form',
  render: () => <FormDemo />,
  decorators: [ToastDecorator],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
} satisfies Story;
