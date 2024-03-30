import type { Meta, StoryObj } from '@storybook/react';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '.';

const meta = {
  title: 'Navigation / Context Menu',
  component: ContextMenu,
  argTypes: {
    dir: {
      control: 'radio',
      description:
        'The reading direction of submenus when applicable. If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.',
      options: ['ltr', 'rtl'],
      table: {
        type: { summary: 'enum', detail: '"ltr" | "rtl"' },
      },
      type: {
        name: 'enum',
        value: ['ltr', 'rtl'],
      },
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Event handler called when the open state of the context menu changes.',
      table: {
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    modal: {
      control: 'boolean',
      description:
        'The modality of the context menu. When set to `true`, interaction with outside elements will be disabled and only menu content will be visible to screen readers.',
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
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <ContextMenuTrigger className='flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm'>
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className='w-64'>
          <ContextMenuItem inset>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent className='w-48'>
              <ContextMenuItem>
                Save Page As...
                <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>
            Show Bookmarks Bar
            <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value='pedro'>
            <ContextMenuLabel inset>People</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioItem value='pedro'>Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value='colm'>Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </>
    ),
  },
} satisfies Story;
