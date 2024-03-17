import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Label } from '#/data-entry';
import { toast, ToastDecorator } from '#/feedback';
import { Button } from '#/general';
import { RadioGroup, RadioGroupItem } from '.';

const meta = {
  title: 'Data Entry / Radio Group',
  component: RadioGroup,
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
      control: 'text',
      description:
        'The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    value: {
      control: 'text',
      description:
        'The controlled value of the radio item to check. Should be used in conjunction with `onValueChange`.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    onValueChange: {
      action: 'onChanged',
      description: 'Event handler called when the value changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(value: string) => void' },
      },
      type: {
        name: 'function',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with radio items.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    name: {
      control: 'text',
      description: 'The name of the group. Submitted with its owning form as part of a name/value pair.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    required: {
      control: 'boolean',
      description:
        'When `true`, indicates that the user must check a radio item before the owning form can be submitted.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    orientation: {
      control: 'radio',
      description: 'The orientation of the component.',
      options: ['horizontal', 'vertical', undefined],
      table: {
        defaultValue: { summary: undefined },
        type: { summary: 'enum', detail: '"horizontal" | "vertical" | undefined' },
      },
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical', 'undefined'],
      },
    },
    dir: {
      control: 'radio',
      description:
        'The reading direction of the radio group. If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.',
      options: ['ltr', 'rtl'],
      table: {
        type: { summary: 'enum', detail: '"ltr" | "rtl"' },
      },
      type: {
        name: 'enum',
        value: ['ltr', 'rtl'],
      },
    },
    loop: {
      control: 'boolean',
      description: 'When `true`, keyboard navigation will loop from last item to first, and vice versa.',
      table: {
        defaultValue: { summary: true },
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
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    defaultValue: 'comfortable',
    children: (
      <>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='default' id='r1' />
          <Label htmlFor='r1'>Default</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='comfortable' id='r2' />
          <Label htmlFor='r2'>Comfortable</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value='compact' id='r3' />
          <Label htmlFor='r3'>Compact</Label>
        </div>
      </>
    ),
  },
} satisfies Story;

const FormDemo = () => {
  const FormSchema = z.object({
    type: z.enum(['all', 'mentions', 'none'], {
      required_error: 'You need to select a notification type.',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-[300px] space-y-6'>
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col space-y-1'
                >
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='all' />
                    </FormControl>
                    <FormLabel className='font-normal'>All new messages</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='mentions' />
                    </FormControl>
                    <FormLabel className='font-normal'>Direct messages and mentions</FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='none' />
                    </FormControl>
                    <FormLabel className='font-normal'>Nothing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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
        iframeHeight: 400,
      },
    },
  },
} satisfies Story;
