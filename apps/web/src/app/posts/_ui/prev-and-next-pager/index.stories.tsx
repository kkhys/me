import type { Meta, StoryObj } from "@storybook/react";
import { PrevAndNextPager } from "#/app/posts/_ui";
import { getPublicPostMetadata } from "#/utils/post";

const meta = {
  title: "Post / Prev and Next Pager",
  component: PrevAndNextPager,
  argTypes: {
    id: {
      control: "text",
      description: "The ID of the current post.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PrevAndNextPager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    id: "posts/build/2024-03-10/index.mdx",
  },
} satisfies Story;

export const FirstPage = {
  args: {
    id: getPublicPostMetadata().slice(-1)[0]?._id ?? "",
  },
} satisfies Story;

export const LastPage = {
  args: {
    id: getPublicPostMetadata()[0]?._id ?? "",
  },
} satisfies Story;
