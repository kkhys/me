import type { PartialStoryFn } from '@storybook/csf';
import type { Meta, ReactRenderer, StoryObj } from '@storybook/react';

import { useToast } from '#/ui/feedback/toast/use-toast';
import { Button } from '#/ui/general';
import { Toast, ToastAction, Toaster } from '.';

export const ToastDecorator = (Story: PartialStoryFn<ReactRenderer>) => (
  <>
    <Story />
    <Toaster />
  </>
);

const meta = {
  title: 'Feedback / Toast',
  component: Toast,
  excludeStories: ['ToastDecorator'],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      description: 'The visual style of the toast.',
      options: ['default', 'destructive'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'enum', detail: '"default" | "destructive"' },
      },
      type: {
        name: 'enum',
        value: ['default', 'destructive'],
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
    type: {
      control: 'radio',
      description:
        'Control the <a href="https://www.radix-ui.com/primitives/docs/components/toast#sensitivity" target="_blank" rel="noreferrer noopener">sensitivity</a> of the toast for accessibility purposes. For toasts that are the result of a user action, choose `foreground`. Toasts generated from background tasks should use `background`.',
      options: ['foreground', 'background'],
      table: {
        defaultValue: { summary: 'foreground' },
        type: { summary: 'enum', detail: '"foreground" | "background"' },
      },
      type: {
        name: 'enum',
        value: ['foreground', 'background'],
      },
    },
    duration: {
      control: 'number',
      description:
        'The time in milliseconds that should elapse before automatically closing the toast. This will override the value supplied to the provider.',
      table: {
        type: { summary: 'number' },
      },
      type: {
        name: 'number',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description:
        'The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.',
      table: {
        defaultValue: { summary: true },
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the dialog. Must be used in conjunction with `onOpenChange`.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
    onOpenChange: {
      description: 'Event handler called when the open state of the dialog changes.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(open: boolean) => void' },
      },
      type: {
        name: 'function',
      },
    },
    onEscapeKeyDown: {
      description:
        'Event handler called when the escape key is down. It can be prevented by calling `event.preventDefault`.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(event: KeyboardEvent) => void' },
      },
      type: {
        name: 'function',
      },
    },
    onPause: {
      description:
        'Event handler called when the dismiss timer is paused. This occurs when the pointer is moved over the viewport, the viewport is focused or when the window is blurred.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '() => void' },
      },
      type: {
        name: 'function',
      },
    },
    onResume: {
      description:
        'Event handler called when the dismiss timer is resumed. This occurs when the pointer is moved away from the viewport, the viewport is blurred or when the window is focused.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '() => void' },
      },
      type: {
        name: 'function',
      },
    },
    onSwipeStart: {
      description:
        'Event handler called when starting a swipe interaction. It can be prevented by calling `event.preventDefault`.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(event: SwipeEvent) => void' },
      },
      type: {
        name: 'function',
      },
    },
    onSwipeMove: {
      description:
        'Event handler called during a swipe interaction. It can be prevented by calling `event.preventDefault`.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(event: SwipeEvent) => void' },
      },
      type: {
        name: 'function',
      },
    },
    onSwipeEnd: {
      description:
        'Event handler called at the end of a swipe interaction. It can be prevented by calling event.preventDefault.',
      table: {
        category: 'Events',
        type: { summary: 'function', detail: '(event: SwipeEvent) => void' },
      },
      type: {
        name: 'function',
      },
    },
    forceMount: {
      control: 'boolean',
      description:
        'Used to force mounting when more control is needed. Useful when controlling animation with React animation libraries.',
      table: {
        type: { summary: 'boolean' },
      },
      type: {
        name: 'boolean',
      },
    },
  },
  decorators: [ToastDecorator],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultDemo = () => {
  const { toast } = useToast();
  return (
    <Button
      variant='outline'
      onClick={() => {
        toast({
          title: 'Scheduled: Catch up ',
          description: 'Friday, February 10, 2023 at 5:57 PM',
          action: <ToastAction altText='Goto schedule to undo'>Undo</ToastAction>,
        });
      }}
    >
      Add to calendar
    </Button>
  );
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

const SimpleDemo = () => {
  const { toast } = useToast();

  return (
    <Button
      variant='outline'
      onClick={() => {
        toast({
          description: 'Your message has been sent.',
        });
      }}
    >
      Show Toast
    </Button>
  );
};

export const Simple: Story = {
  render: () => <SimpleDemo />,
};

const WithTitleDemo = () => {
  const { toast } = useToast();

  return (
    <Button
      variant='outline'
      onClick={() => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }}
    >
      Show Toast
    </Button>
  );
};

export const WithTitle: Story = {
  render: () => <WithTitleDemo />,
};

const WithActionDemo = () => {
  const { toast } = useToast();

  return (
    <Button
      variant='outline'
      onClick={() => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>,
        });
      }}
    >
      Show Toast
    </Button>
  );
};

export const WithAction: Story = {
  render: () => <WithActionDemo />,
};

const DestructiveDemo = () => {
  const { toast } = useToast();

  return (
    <Button
      variant='outline'
      onClick={() => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>,
        });
      }}
    >
      Show Toast
    </Button>
  );
};

export const Destructive: Story = {
  render: () => <DestructiveDemo />,
};
