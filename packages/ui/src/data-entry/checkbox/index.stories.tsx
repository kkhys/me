import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Checkbox } from '.';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  toast,
  ToastDecorator,
} from '../../';

const meta = {
  title: 'Data Entry / Checkbox',
  component: Checkbox,
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
        'The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    checked: {
      control: 'boolean',
      description:
        'The controlled checked state of the checkbox. Must be used in conjunction with `onCheckedChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onCheckedChange: {
      action: 'checked',
      description:
        'Event handler called when the checked state of the checkbox changes.',
      table: {
        category: 'Events',
        type: {
          summary: 'function',
          detail: '(checked: boolean | "indeterminate") => void',
        },
      },
      type: {
        name: 'function',
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'When true, prevents the user from interacting with the checkbox.',
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
        'When true, indicates that the user must check the checkbox before the owning form can be submitted.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    name: {
      control: 'text',
      description:
        'The name of the checkbox. Submitted with its owning form as part of a name/value pair.',
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
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    id: 'default-checkbox',
    'aria-label': 'Accept terms and conditions',
  },
  decorators: [
    (Story) => (
      <div className='flex items-center space-x-2'>
        <Story />
        <Label htmlFor='default-checkbox'>Accept terms and conditions</Label>
      </div>
    ),
  ],
} satisfies Story;

export const WithText = {
  args: {
    id: 'with-text-checkbox',
    'aria-label': 'Accept terms and conditions',
  },
  decorators: [
    (Story) => (
      <div className='items-top flex space-x-2'>
        <Story />
        <div className='grid gap-1.5 leading-none'>
          <Label htmlFor='with-text-checkbox'>
            Accept terms and conditions
          </Label>
          <p className='text-sm text-muted-foreground'>
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Story;

export const Disabled = {
  args: {
    id: 'disabled-checkbox',
    disabled: true,
    'aria-label': 'Accept terms and conditions',
  },
  decorators: [
    (Story) => (
      <div className='flex items-center space-x-2'>
        <Story />
        <Label htmlFor='disabled-checkbox'>Accept terms and conditions</Label>
      </div>
    ),
  ],
} satisfies Story;

const FormSingleDemo = () => {
  const FormSchema = z.object({
    mobile: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: true,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='mobile'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the{' '}
                  <a href='/'>mobile settings</a> page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export const FormSingle = {
  render: () => <FormSingleDemo />,
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

const FormMultipleDemo = () => {
  const items = [
    {
      id: 'recents',
      label: 'Recents',
    },
    {
      id: 'home',
      label: 'Home',
    },
    {
      id: 'applications',
      label: 'Applications',
    },
    {
      id: 'desktop',
      label: 'Desktop',
    },
    {
      id: 'downloads',
      label: 'Downloads',
    },
    {
      id: 'documents',
      label: 'Documents',
    },
  ] as const;

  const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ['recents', 'home'],
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className='flex flex-row items-start space-x-3 space-y-0'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-normal'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};

export const FormMultiple = {
  render: () => <FormMultipleDemo />,
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
