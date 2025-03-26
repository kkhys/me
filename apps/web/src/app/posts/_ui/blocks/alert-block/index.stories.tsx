import { Prose } from "@kkhys/ui/prose";
import type { Meta, StoryObj } from "@storybook/react";
import { AlertBlock } from "#/app/posts/_ui/blocks/alert-block";

const meta = {
  title: "Post / Block / Alert Block",
  component: AlertBlock,
  argTypes: {
    type: {
      control: {
        type: "radio",
        description: "The type of the alert.",
        options: ["note", "tip", "important", "warning"],
      },
      table: {
        defaultValue: { summary: "note" },
        type: {
          summary: "enum",
          detail: '"note" | "tip" | "important" | "warning"',
        },
      },
      type: {
        name: "enum",
        value: ["note", "tip", "important", "warning"],
      },
    },
    description: {
      control: "text",
      description: "The description of the alert.",
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
        <Prose>
          <Story />
        </Prose>
      </div>
    ),
  ],
} satisfies Meta<typeof AlertBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note = {
  args: {
    type: "note",
    description:
      "情報量の多いページで、ユーザが重要な情報を見逃さないようにするために使用する。記事全体の概要を簡単に伝えたい場合にも使用できる。",
  },
} satisfies Story;

export const Tip = {
  args: {
    type: "tip",
    description:
      "ユーザが役立つと感じる情報を提供するために使用する。記事の内容をより深く理解するためのヒントやコツなどを提供する。",
  },
} satisfies Story;

export const Important = {
  args: {
    type: "important",
    description:
      "ユーザが絶対に知っておくべき重要な情報を伝えるために使用する。警告や注意喚起などにも使用できる。",
  },
} satisfies Story;

export const Warning = {
  args: {
    type: "warning",
    description:
      "ユーザが危険な状況を回避するために必要な情報を伝えるために使用する。緊急性の高い警告などにも使用できる。",
  },
} satisfies Story;
