import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@kkhys/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kkhys/ui/dialog";
import { Input } from "@kkhys/ui/input";
import { Label } from "@kkhys/ui/label";
import { fn } from "@storybook/test";

const meta = {
  title: "Feedback / Dialog",
  component: Dialog,
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description:
        "The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    open: {
      control: "boolean",
      description:
        "The controlled open state of the dialog. Must be used in conjunction with `onOpenChange`.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    onOpenChange: {
      action: "changed",
      description:
        "Event handler called when the open state of the dialog changes.",
      table: {
        category: "Events",
        type: { summary: "function", detail: "(open: boolean) => void" },
      },
      type: {
        name: "function",
      },
    },
    modal: {
      control: "boolean",
      description:
        "The modality of the dialog. When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    children: (
      <>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </>
    ),
  },
} satisfies Story;
