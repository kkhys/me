import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Popover, PopoverContent, PopoverTrigger } from '#/data-display';
import {
  Calendar,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/data-entry';
import { toast, ToastDecorator } from '#/feedback';
import { Button } from '#/general';
import { cn } from '#/utils';

const meta = {
  title: 'Data Entry / Calendar',
  component: Calendar,
  argTypes: {
    mode: {
      control: 'radio',
      description: 'The selection mode of the calendar.',
      options: ['single', 'multiple', 'range', 'default'],
      table: {
        defaultValue: { summary: 'single' },
        type: { summary: 'enum', detail: '"single" | "multiple" | "range" | "default"' },
      },
      type: {
        name: 'enum',
        value: ['single', 'multiple', 'range', 'default'],
        required: true,
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultDemo = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return <Calendar mode='single' selected={date} onSelect={setDate} className='rounded-md border shadow' />;
};

export const Default = {
  render: () => <DefaultDemo />,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
} satisfies Story;

export const FormDemo = () => {
  const FormSchema = z.object({
    dob: z.date({
      required_error: 'A date of birth is required.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast('You submitted the following values:', {
      description: (
        <pre className='mt-2 w-[320px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto size-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
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
  render: () => <FormDemo />,
  decorators: [ToastDecorator],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
} satisfies Story;
