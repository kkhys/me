import { Prose } from "@kkhys/ui/prose";
import type { Meta, StoryObj } from "@storybook/react";
import { GoogleMapsBlock } from "#/app/posts/_ui/blocks/google-maps-block";

const meta = {
  title: "Post / Block / Google Maps Block",
  component: GoogleMapsBlock,
  argTypes: {
    placeId: {
      control: "text",
      description: "The place ID of the location to show.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    caption: {
      control: "text",
      description: "The caption of the map.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
  },
  args: {
    placeId: "ChIJ2-L1uEhbFkcR-Zek84Ap7zI",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl mx-auto">
        <Prose>
          <Story />
        </Prose>
      </div>
    ),
  ],
} satisfies Meta<typeof GoogleMapsBlock>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default = {} satisfies Story;
export const WithCaption = {
  args: {
    caption: "旧オスカー・シンドラーのホーロー工場",
  },
} satisfies Story;
