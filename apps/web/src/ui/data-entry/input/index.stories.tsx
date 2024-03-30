import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { userEvent, within } from '@storybook/testing-library';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, toast, ToastDecorator } from '@kkhys/ui';

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
import { Input } from '.';

const meta = {
  title: 'Data Entry / Input',
  component: Input,
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'The placeholder text when the input is empty.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When true, prevents the user from interacting with the checkbox.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    type: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const fileInputId = 'file-input';
const withLabelInputId = 'with-label-input';

export const Default = {
  args: {
    type: 'email',
    placeholder: 'Email',
  },
} satisfies Story;

export const File = {
  args: {
    id: fileInputId,
    type: 'file',
  },
  decorators: [
    (Story) => (
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor={fileInputId}>Picture</Label>
        <Story />
      </div>
    ),
  ],
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    type: 'email',
    placeholder: 'Email',
  },
} satisfies Story;

export const WithLabel = {
  args: {
    id: withLabelInputId,
    type: 'email',
    placeholder: 'Email',
  },
  decorators: [
    (Story) => (
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor={withLabelInputId}>Email</Label>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputElement = canvas.getByRole('textbox');

    await step('Enter email and password', async () => {
      await userEvent.type(inputElement, 'example-email@email.com', {
        delay: 100,
      });
    });
  },
} satisfies Story;

export const WithButton = {
  args: {
    type: 'email',
    placeholder: 'Email',
  },
  decorators: [
    (Story) => (
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Story />
        <Button type='submit'>Send</Button>
      </div>
    ),
  ],
} satisfies Story;

export const FormDemo = () => {
  const FormSchema = z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
    },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-[400px] space-y-6'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
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
