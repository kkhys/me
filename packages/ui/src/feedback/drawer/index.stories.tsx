import type { Meta, StoryObj } from "@storybook/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

import { Button } from "@kkhys/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kkhys/ui/drawer";

const meta = {
  title: "Feedback / Drawer",
  component: Drawer,
  argTypes: {
    shouldScaleBackground: {
      control: "boolean",
      description: "Whether the background should scale.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultDemo = ({
  shouldScaleBackground,
}: {
  shouldScaleBackground?: boolean;
}) => {
  const [goal, setGoal] = React.useState(350);

  const onClick = (adjustment: number) =>
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));

  return (
    <Drawer shouldScaleBackground={shouldScaleBackground}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <MinusIcon className="size-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <PlusIcon className="size-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]" />
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const Default = {
  render: ({ shouldScaleBackground }) => (
    <DefaultDemo shouldScaleBackground={shouldScaleBackground} />
  ),
  args: {
    shouldScaleBackground: true,
  },
  decorators: [
    (Story) => (
      <div vaul-drawer-wrapper="">
        <Story />
      </div>
    ),
  ],
} satisfies Story;
