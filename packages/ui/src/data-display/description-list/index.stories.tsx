import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@kkhys/ui/description-list";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Data Display / Description List",
  component: DescriptionList,
  argTypes: {
    className: {
      table: {
        disable: true,
      },
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    className: "w-[350px]",
    children: (
      <>
        <DescriptionTerm>Full Name</DescriptionTerm>
        <DescriptionDetails>Johnathan A. Doe</DescriptionDetails>
        <DescriptionTerm>Job Title</DescriptionTerm>
        <DescriptionDetails>Senior Frontend Developer</DescriptionDetails>
        <DescriptionTerm>Company</DescriptionTerm>
        <DescriptionDetails>Awesome Tech Ltd.</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>john.doe@example.com</DescriptionDetails>
        <DescriptionTerm>Phone</DescriptionTerm>
        <DescriptionDetails>+1 (123) 456-7890</DescriptionDetails>
        <DescriptionTerm>Address</DescriptionTerm>
        <DescriptionDetails>
          123 Main Street, Suite 500, San Francisco, CA 94105
        </DescriptionDetails>
        <DescriptionTerm>Hobbies</DescriptionTerm>
        <DescriptionDetails>
          Photography, Hiking, and Traveling
        </DescriptionDetails>
      </>
    ),
  },
} satisfies Story;
