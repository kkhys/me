import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { Component } from "react";

import { Button } from "@kkhys/ui/button";
import { Toaster, toast } from "@kkhys/ui/toast";

export const ToastDecorator: Decorator = (Story) => (
  <div className="p-4">
    <Story />
    <Toaster position="top-center" richColors />
  </div>
);

const meta = {
  title: "Feedback / Toast",
  component: Component,
  excludeStories: ["ToastDecorator"],
  decorators: [ToastDecorator],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  ),
} satisfies Story;

// export const Success = {
//   render: () => (
//     <Button
//       variant="outline"
//       onClick={() =>
//         toast.success("Event has been created", {
//           description: "Sunday, December 03, 2023, at 9:00 AM",
//         })
//       }
//     >
//       Show Toast
//     </Button>
//   ),
// } satisfies Story;
