import type { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';

import { Separator } from '@kkhys/ui';

import { ScrollArea, ScrollBar } from '.';

const meta = {
  title: 'Data Display / Scroll Area',
  component: ScrollArea,
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
    type: {
      control: 'radio',
      description:
        'Describes the nature of scrollbar visibility, similar to how the scrollbar preferences in MacOS control visibility of native scrollbars.\n\n' +
        '`"auto"` means that scrollbars are visible when content is overflowing on the corresponding orientation.\n\n' +
        '`"always"` means that scrollbars are always visible regardless of whether the content is overflowing.\n\n' +
        '`"scroll"` means that scrollbars are visible when the user is scrolling along its corresponding orientation.\n\n' +
        '`"hover"` when the user is scrolling along its corresponding orientation and when the user is hovering over the scroll area.',
      options: ['auto', 'always', 'scroll', 'hover'],
      table: {
        defaultValue: { summary: 'hover' },
        type: { summary: 'enum', detail: '"auto" | "always" | "scroll" | "hover"' },
      },
      type: {
        name: 'enum',
        value: ['auto', 'always', 'scroll', 'hover'],
      },
    },
    scrollHideDelay: {
      control: 'number',
      description:
        'If `type` is set to either `"scroll"` or `"hover"`, this prop determines the length of time, in milliseconds, before the scrollbars are hidden after the user stops interacting with scrollbars.',
      table: {
        defaultValue: { summary: 600 },
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    dir: {
      control: 'radio',
      description:
        'The reading direction of the scroll area. If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode.',
      options: ['ltr', 'rtl'],
      table: {
        type: { summary: 'enum', detail: '"ltr" | "rtl"' },
      },
      type: {
        name: 'enum',
        value: ['ltr', 'rtl'],
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
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export const Default = {
  args: {
    className: 'h-72 w-48 rounded-md border',
    children: (
      <div className='p-4'>
        <h4 className='mb-4 text-sm font-medium leading-none'>Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className='text-sm'>
              {tag}
            </div>
            <Separator className='my-2' />
          </>
        ))}
      </div>
    ),
  },
} satisfies Story;

const works = [
  {
    artist: 'Ornella Binni',
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Tom Byrom',
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Vladimir Malyavko',
    art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
  },
];

export const HorizontalScrolling = {
  args: {
    className: 'w-96 whitespace-nowrap rounded-md border',
    children: (
      <>
        <div className='flex w-max space-x-4 p-4'>
          {works.map((artwork) => (
            <figure key={artwork.artist} className='shrink-0'>
              <div className='overflow-hidden rounded-md'>
                <Image
                  src={artwork.art}
                  alt={`Photo by ${artwork.artist}`}
                  className='aspect-[3/4] h-fit w-fit object-cover'
                  width={300}
                  height={400}
                />
              </div>
              <figcaption className='pt-2 text-xs text-muted-foreground'>
                Photo by <span className='font-medium text-foreground'>{artwork.artist}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ScrollBar orientation='horizontal' />
      </>
    ),
  },
} satisfies Story;
