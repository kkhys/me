import type { Meta, StoryObj } from '@storybook/react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '#/ui/data-entry';
import { toast, ToastDecorator } from '#/ui/feedback';
import { Button } from '#/ui/general';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '.';

const meta = {
  title: 'Data Entry / Select',
  component: Select,
  argTypes: {
    defaultValue: {
      control: 'text',
      description:
        'The value of the select when initially rendered. Use when you do not need to control the state of the select.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    value: {
      control: 'text',
      description: 'The controlled value of the select. Should be used in conjunction with `onValueChange`.',
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
        category: 'Events',
        type: { summary: 'function', detail: '(value: string) => void' },
      },
      type: {
        name: 'function',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the select when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the select. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      action: 'changed',
      description: 'Event handler called when the open state of the select changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    dir: {
      control: 'radio',
      description:
        'The reading direction of the select when applicable. If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.',
      options: ['ltr', 'rtl'],
      table: {
        type: { summary: 'enum', detail: '"ltr" | "rtl"' },
      },
      type: {
        name: 'enum',
        value: ['ltr', 'rtl'],
      },
    },
    name: {
      control: 'text',
      description: 'The name of the select. Submitted with its owning form as part of a name/value pair.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with select.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    required: {
      control: 'boolean',
      description: 'When `true`, indicates that the user must select a value before the owning form can be submitted.',
      table: {
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Theme' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='light'>Light</SelectItem>
          <SelectItem value='dark'>Dark</SelectItem>
          <SelectItem value='system'>System</SelectItem>
        </SelectContent>
      </>
    ),
  },
} satisfies Story;

export const Scrollable = {
  args: {
    children: (
      <>
        <SelectTrigger className='w-[280px]'>
          <SelectValue placeholder='Select a timezone' />
        </SelectTrigger>
        <SelectContent className='h-[200px]'>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value='est'>Eastern Standard Time (EST)</SelectItem>
            <SelectItem value='cst'>Central Standard Time (CST)</SelectItem>
            <SelectItem value='mst'>Mountain Standard Time (MST)</SelectItem>
            <SelectItem value='pst'>Pacific Standard Time (PST)</SelectItem>
            <SelectItem value='akst'>Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value='hst'>Hawaii Standard Time (HST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value='gmt'>Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value='cet'>Central European Time (CET)</SelectItem>
            <SelectItem value='eet'>Eastern European Time (EET)</SelectItem>
            <SelectItem value='west'>Western European Summer Time (WEST)</SelectItem>
            <SelectItem value='cat'>Central Africa Time (CAT)</SelectItem>
            <SelectItem value='eat'>East Africa Time (EAT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value='msk'>Moscow Time (MSK)</SelectItem>
            <SelectItem value='ist'>India Standard Time (IST)</SelectItem>
            <SelectItem value='cst_china'>China Standard Time (CST)</SelectItem>
            <SelectItem value='jst'>Japan Standard Time (JST)</SelectItem>
            <SelectItem value='kst'>Korea Standard Time (KST)</SelectItem>
            <SelectItem value='ist_indonesia'>Indonesia Central Standard Time (WITA)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value='awst'>Australian Western Standard Time (AWST)</SelectItem>
            <SelectItem value='acst'>Australian Central Standard Time (ACST)</SelectItem>
            <SelectItem value='aest'>Australian Eastern Standard Time (AEST)</SelectItem>
            <SelectItem value='nzst'>New Zealand Standard Time (NZST)</SelectItem>
            <SelectItem value='fjt'>Fiji Time (FJT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value='art'>Argentina Time (ART)</SelectItem>
            <SelectItem value='bot'>Bolivia Time (BOT)</SelectItem>
            <SelectItem value='brt'>Brasilia Time (BRT)</SelectItem>
            <SelectItem value='clt'>Chile Standard Time (CLT)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </>
    ),
  },
} satisfies Story;

const FormStoryDemo = () => {
  const FormSchema = z.object({
    email: z
      .string({
        required_error: 'Please select an email to display.',
      })
      .email(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-[400px] space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your <Link href='/'>email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export const FormStory = {
  name: 'Form',
  render: () => <FormStoryDemo />,
  decorators: [ToastDecorator],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
} satisfies Story;
