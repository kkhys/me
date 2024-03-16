import type { Meta, StoryObj } from '@storybook/react';
import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';

import { ToggleGroup, ToggleGroupItem } from '.';

const meta = {
  title: 'General / Toggle Group',
  component: ToggleGroup,
  argTypes: {
    type: {
      control: 'radio',
      description: 'Determines whether a single or multiple items can be pressed at a time.',
      options: ['single', 'multiple'],
      table: {
        type: { summary: 'enum', detail: '"single" | "multiple"' },
      },
      type: {
        name: 'enum',
        value: ['single', 'multiple'],
        required: true,
      },
    },
    variant: {
      control: 'radio',
      description: 'The visual variant to use for the toggle.',
      options: ['default', 'outline'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "outline"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'outline'],
      },
    },
    size: {
      control: 'radio',
      description: 'The size of the toggle.',
      options: ['default', 'sm', 'lg'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "sm" | "lg"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'sm', 'lg'],
      },
    },
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
    value: {
      if: { arg: 'type', eq: 'single' },
      control: 'text',
      description:
        'The controlled value of the pressed item when `type` is `"single"`. Must be used in conjunction with `onValueChange`.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    defaultValue: {
      if: { arg: 'type', eq: 'single' },
      control: 'text',
      description:
        'The value of the item to show as pressed when initially rendered and `type` is `"single"`. Use when you do not need to control the state of the items.',
      table: {
        type: { summary: 'string' },
      },
      type: {
        name: 'string',
      },
    },
    onValueChange: {
      if: { arg: 'type', eq: 'single' },
      action: 'changed',
      description: 'Event handler called when the pressed state of an item changes and `type` is `"single"`.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(value: string) => void' },
      },
      type: {
        name: 'function',
      },
    },
    // value: {
    //   if: { arg: 'type', eq: 'multiple' },
    //   control: 'object',
    //   description:
    //     'The controlled value of the pressed items when `type` is `"multiple"`. Must be used in conjunction with `onValueChange`.',
    //   table: {
    //     defaultValue: { summary: '[]' },
    //     type: { summary: 'string[]' },
    //   },
    //   type: {
    //     name: 'array',
    //     value: {
    //       name: 'string',
    //     },
    //   },
    // },
    // defaultValue: {
    //   if: { arg: 'type', eq: 'multiple' },
    //   control: 'object',
    //   description:
    //     'The values of the items to show as pressed when initially rendered and `type` is `"multiple"`. Use when you do not need to control the state of the items.',
    //   table: {
    //     defaultValue: { summary: '[]' },
    //     type: { summary: 'string[]' },
    //   },
    //   type: {
    //     name: 'array',
    //     value: {
    //       name: 'string',
    //     },
    //   },
    // },
    // onValueChange: {
    //   if: { arg: 'type', eq: 'multiple' },
    //   action: 'changed',
    //   description: 'Event handler called when the pressed state of an item changes and `type` is `"multiple"`.',
    //   table: {
    //     category: 'Events',
    //     type: { summary: 'function', detail: '(value: string[]) => void' },
    //   },
    //   type: {
    //     name: 'function',
    //   },
    // },
    disabled: {
      control: 'boolean',
      description: 'When `true`, prevents the user from interacting with the toggle group and all its items.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    rovingFocus: {
      control: 'boolean',
      description: 'When false, navigating through the items using arrow keys will be disabled.',
      table: {
        defaultValue: { summary: true },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    orientation: {
      control: 'radio',
      description:
        'The orientation of the component, which determines how focus moves: `horizontal` for left/right arrows and `vertical` for up/down arrows.',
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
        'The reading direction of the toggle group. If omitted, inherits globally from DirectionProvider or assumes LTR (left-to-right) reading mode.',
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
      description:
        'When `true` and `rovingFocus` is `true`, keyboard navigation will loop from last item to first, and vice versa.',
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
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    type: 'multiple',
    children: (
      <>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <FontBoldIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <FontItalicIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
          <UnderlineIcon className='size-4' />
        </ToggleGroupItem>
      </>
    ),
  },
} satisfies Story;

export const Outline = {
  args: {
    type: 'multiple',
    variant: 'outline',
    children: (
      <>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <FontBoldIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <FontItalicIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
          <UnderlineIcon className='size-4' />
        </ToggleGroupItem>
      </>
    ),
  },
} satisfies Story;

export const Single = {
  args: {
    type: 'single',
    children: (
      <>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <FontBoldIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <FontItalicIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
          <UnderlineIcon className='size-4' />
        </ToggleGroupItem>
      </>
    ),
  },
} satisfies Story;

export const Small = {
  args: {
    type: 'single',
    size: 'sm',
    children: (
      <>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <FontBoldIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <FontItalicIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
          <UnderlineIcon className='size-4' />
        </ToggleGroupItem>
      </>
    ),
  },
} satisfies Story;

export const Large = {
  args: {
    type: 'multiple',
    size: 'lg',
    children: (
      <>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <FontBoldIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <FontItalicIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
          <UnderlineIcon className='size-4' />
        </ToggleGroupItem>
      </>
    ),
  },
} satisfies Story;

export const Disabled = {
  args: {
    type: 'multiple',
    disabled: true,
    children: (
      <>
        <ToggleGroupItem value='bold' aria-label='Toggle bold'>
          <FontBoldIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='italic' aria-label='Toggle italic'>
          <FontItalicIcon className='size-4' />
        </ToggleGroupItem>
        <ToggleGroupItem value='strikethrough' aria-label='Toggle strikethrough'>
          <UnderlineIcon className='size-4' />
        </ToggleGroupItem>
      </>
    ),
  },
} satisfies Story;
