import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Animation / FadeIn",
  component: FadeIn,
  subcomponents: { FadeInStagger },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof FadeIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FadeIn>Fade In Content</FadeIn>,
};

export const Staggered = {
  render: () => (
    <FadeInStagger>
      <FadeIn>
        <div>Item 1</div>
      </FadeIn>
      <FadeIn>
        <div>Item 2</div>
      </FadeIn>
      <FadeIn>
        <div>Item 3</div>
      </FadeIn>
    </FadeInStagger>
  ),
} satisfies Story;

export const StaggeredFaster = {
  render: () => (
    <FadeInStagger faster>
      <FadeIn>
        <div>Item 1</div>
      </FadeIn>
      <FadeIn>
        <div>Item 2</div>
      </FadeIn>
      <FadeIn>
        <div>Item 3</div>
      </FadeIn>
    </FadeInStagger>
  ),
} satisfies Story;
