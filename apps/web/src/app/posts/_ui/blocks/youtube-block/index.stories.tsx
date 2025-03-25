import { Prose } from "@kkhys/ui/prose";
import type { Meta, StoryObj } from "@storybook/react";
import { YouTubeBlock } from "#/app/posts/_ui/blocks/youtube-block";

const meta = {
  title: "Post / Block / YouTube Block",
  component: YouTubeBlock,
  argTypes: {
    videoId: {
      control: "text",
      description: "The ID of the YouTube video to show.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
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
} satisfies Meta<typeof YouTubeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    videoId: "eZCSOdi19jQ",
  },
} satisfies Story;
