import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
} from '#/ui/data-entry';
import { toast, ToastDecorator } from '#/ui/feedback';
import { Button } from '#/ui/general';
import { Textarea } from '.';

const meta = {
  title: 'Data Entry / Textarea',
  component: Textarea,
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'The placeholder text when there is no value present.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether or not the switch is disabled.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    placeholder: 'Type your message here.',
    className: 'w-[400px]',
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    placeholder: 'Type your message here.',
    className: 'w-[400px]',
  },
} satisfies Story;

const withLabelTextareaId = 'with-label-textarea';
export const WithLabel = {
  args: {
    id: withLabelTextareaId,
    placeholder: 'Type your message here.',
    className: 'w-[400px]',
  },
  decorators: [
    (Story) => (
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor={withLabelTextareaId}>Your Message</Label>
        <Story />
      </div>
    ),
  ],
} satisfies Story;

const withLabelTextareaIdAndLabel = 'with-label-textarea-and-label';
export const WithText = {
  args: {
    id: withLabelTextareaIdAndLabel,
    placeholder: 'Type your message here.',
    className: 'w-[400px]',
  },
  decorators: [
    (Story) => (
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor={withLabelTextareaIdAndLabel}>Your Message</Label>
        <Story />
        <p className='text-sm text-muted-foreground'>Your message will be copied to the support team.</p>
      </div>
    ),
  ],
} satisfies Story;

export const WithButton = {
  args: {
    placeholder: 'Type your message here.',
    className: 'w-[400px]',
  },
  decorators: [
    (Story) => (
      <div className='grid w-full gap-2'>
        <Story />
        <Button>Send message</Button>
      </div>
    ),
  ],
} satisfies Story;

const FormDemo = () => {
  const FormSchema = z.object({
    bio: z
      .string()
      .min(10, {
        message: 'Bio must be at least 10 characters.',
      })
      .max(160, {
        message: 'Bio must not be longer than 30 characters.',
      }),
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
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder='Tell us a little bit about yourself' className='resize-none' {...field} />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
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
