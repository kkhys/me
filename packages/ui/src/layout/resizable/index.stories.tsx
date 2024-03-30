import type { Meta, StoryObj } from '@storybook/react';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '.';

const meta = {
  title: 'Layout / Resizable',
  component: ResizablePanelGroup,
  decorators: [
    (Story) => (
      <div className='w-[400px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    direction: 'horizontal',
    className: 'max-w-md rounded-lg border',
    children: (
      <>
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className='flex h-[200px] items-center justify-center p-6'>
            <span className='font-medium'>One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <ResizablePanelGroup direction='vertical'>
            <ResizablePanel defaultSize={25} minSize={20}>
              <div className='flex h-full items-center justify-center p-6'>
                <span className='font-medium'>Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75} minSize={20}>
              <div className='flex h-full items-center justify-center p-6'>
                <span className='font-medium'>Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </>
    ),
  },
} satisfies Story;

export const Vertical = {
  args: {
    direction: 'vertical',
    className: 'min-h-[200px] max-w-md rounded-lg border',
    children: (
      <>
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className='flex h-full items-center justify-center p-6'>
            <span className='font-medium'>Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} minSize={20}>
          <div className='flex h-full items-center justify-center p-6'>
            <span className='font-medium'>Content</span>
          </div>
        </ResizablePanel>
      </>
    ),
  },
} satisfies Story;

export const Handle = {
  args: {
    direction: 'horizontal',
    className: 'min-h-[200px] max-w-md rounded-lg border',
    children: (
      <>
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className='flex h-full items-center justify-center p-6'>
            <span className='font-medium'>Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={20}>
          <div className='flex h-full items-center justify-center p-6'>
            <span className='font-medium'>Content</span>
          </div>
        </ResizablePanel>
      </>
    ),
  },
} satisfies Story;
