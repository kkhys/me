import type { Meta, StoryObj } from "@storybook/react";
import * as z from "zod";

import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  Button,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Label,
  toast,
} from "@kkhys/ui";
import { fn } from "@storybook/test";
import { Checkbox } from ".";
import { ToastDecorator } from "../../feedback/toast/index.stories";

const meta = {
  title: "Data Entry / Checkbox",
  component: Checkbox,
  argTypes: {
    asChild: {
      control: "boolean",
      description:
        'Change the default rendered element for the one passed as a child, merging their props and behavior.\n\nRead our <a href="https://www.radix-ui.com/primitives/docs/guides/composition" target="_blank" rel="noreferrer noopener">Composition</a> guide for more details.',
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    defaultChecked: {
      control: "boolean",
      description:
        "The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    checked: {
      control: "boolean",
      description:
        "The controlled checked state of the checkbox. Must be used in conjunction with `onCheckedChange`.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    onCheckedChange: {
      action: "checked",
      description:
        "Event handler called when the checked state of the checkbox changes.",
      table: {
        category: "Events",
        type: {
          summary: "function",
          detail: '(checked: boolean | "indeterminate") => void',
        },
      },
      type: {
        name: "function",
      },
    },
    disabled: {
      control: "boolean",
      description:
        "When true, prevents the user from interacting with the checkbox.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    required: {
      control: "boolean",
      description:
        "When true, indicates that the user must check the checkbox before the owning form can be submitted.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    name: {
      control: "text",
      description:
        "The name of the checkbox. Submitted with its owning form as part of a name/value pair.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    value: {
      control: "text",
      description: "The value given as data when submitted with a name.",
      table: {
        defaultValue: { summary: "on" },
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
    "aria-label": {
      table: {
        disable: true,
      },
    },
    meta: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    id: "default-checkbox",
    "aria-label": "Accept terms and conditions",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center space-x-2">
        <Story />
        <Label htmlFor="default-checkbox">Accept terms and conditions</Label>
      </div>
    ),
  ],
} satisfies Story;

export const WithText = {
  args: {
    id: "with-text-checkbox",
    "aria-label": "Accept terms and conditions",
  },
  decorators: [
    (Story) => (
      <div className="items-top flex space-x-2">
        <Story />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="with-text-checkbox">
            Accept terms and conditions
          </Label>
          <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Story;

export const Disabled = {
  args: {
    id: "disabled-checkbox",
    disabled: true,
    "aria-label": "Accept terms and conditions",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center space-x-2">
        <Story />
        <Label htmlFor="disabled-checkbox">Accept terms and conditions</Label>
      </div>
    ),
  ],
} satisfies Story;

const FormSingleDemo = (props: React.ComponentProps<typeof Checkbox>) => {
  const FormSchema = z.object({
    mobile: z.boolean().default(false).optional(),
  });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: FormSchema });
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      toast("You submitted the following values:", {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(formData.get("mobile"), null, 2)}
            </code>
          </pre>
        ),
      });
    },
  });

  return (
    <Form context={form.context}>
      <form
        className="flex flex-col items-start gap-y-6"
        {...getFormProps(form)}
      >
        <FormField
          name={fields.mobile.name}
          render={() => (
            <FormItem className="inline-flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <Checkbox meta={fields.mobile} {...props} />
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the{" "}
                  <a href="/" onClick={(e) => e.preventDefault()}>
                    mobile settings
                  </a>{" "}
                  page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const FormSingle = {
  render: (props) => <FormSingleDemo {...props} />,
  decorators: [ToastDecorator],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 400,
      },
    },
  },
} satisfies Story;
