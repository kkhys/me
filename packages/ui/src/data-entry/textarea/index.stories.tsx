import type { Meta, StoryObj } from "@storybook/react";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Button } from "@kkhys/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@kkhys/ui/form";
import { Label } from "@kkhys/ui/label";
import { Textarea } from "@kkhys/ui/textarea";
import { toast } from "@kkhys/ui/toast";
import { expect, userEvent, within } from "@storybook/test";
import { z } from "zod";
import { ToastDecorator } from "../../feedback/toast/index.stories";

const meta = {
  title: "Data Entry / Textarea",
  component: Textarea,
  argTypes: {
    placeholder: {
      control: "text",
      description: "The placeholder text when there is no value present.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether or not the switch is disabled.",
      table: {
        type: { summary: "boolean" },
      },
      type: {
        name: "boolean",
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    meta: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    placeholder: "Type your message here.",
    className: "w-[400px]",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText("Type your message here.");

    await step("Verify placeholder is displayed", async () => {
      await expect(textarea).toBeInTheDocument();
      await expect(textarea).toHaveAttribute(
        "placeholder",
        "Type your message here.",
      );
    });

    await step("Type a message in the textarea", async () => {
      await userEvent.type(textarea, "Hello, this is a test message!", {
        delay: 100,
      });
      await expect(textarea).toHaveValue("Hello, this is a test message!");
    });
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    placeholder: "Type your message here.",
    className: "w-[400px]",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const textarea = canvas.getByPlaceholderText("Type your message here.");

    await step("Verify the textarea is rendered and disabled", async () => {
      await expect(textarea).toBeInTheDocument();
      await expect(textarea).toBeDisabled();
    });

    await step("Attempt to type in the disabled textarea", async () => {
      await userEvent.type(textarea, "This should not appear");
      await expect(textarea).toHaveValue("");
    });
  },
} satisfies Story;

const withLabelTextareaId = "with-label-textarea";
export const WithLabel = {
  args: {
    id: withLabelTextareaId,
    placeholder: "Type your message here.",
    className: "w-[400px]",
  },
  decorators: [
    (Story) => (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={withLabelTextareaId}>Your Message</Label>
        <Story />
      </div>
    ),
  ],
} satisfies Story;

const withLabelTextareaIdAndLabel = "with-label-textarea-and-label";
export const WithText = {
  args: {
    id: withLabelTextareaIdAndLabel,
    placeholder: "Type your message here.",
    className: "w-[400px]",
  },
  decorators: [
    (Story) => (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={withLabelTextareaIdAndLabel}>Your Message</Label>
        <Story />
        <p className="text-sm text-muted-foreground">
          Your message will be copied to the support team.
        </p>
      </div>
    ),
  ],
} satisfies Story;

export const WithButton = {
  args: {
    placeholder: "Type your message here.",
    className: "w-[400px]",
  },
  decorators: [
    (Story) => (
      <div className="grid w-full gap-2">
        <Story />
        <Button>Send message</Button>
      </div>
    ),
  ],
} satisfies Story;

const FormDemo = (props: React.ComponentProps<typeof Textarea>) => {
  const FormSchema = z.object({
    bio: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
  });

  const [form, fields] = useForm({
    id: "form-demo",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: FormSchema });
    },
    onSubmit(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const result = parseWithZod(formData, { schema: FormSchema });

      if (result.status === "success") {
        toast("You submitted the following values:", {
          description: (
            <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(formData.get("bio"), null, 2)}
              </code>
            </pre>
          ),
        });
      }

      if (result.status === "error") {
        toast.error(JSON.stringify(result.error, null, 2));
      }
    },
    shouldRevalidate: "onInput",
    constraint: getZodConstraint(FormSchema),
  });

  return (
    <Form context={form.context}>
      <form className="w-[400px] space-y-6" {...getFormProps(form)}>
        <FormField
          name={fields.bio.name}
          render={() => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <Textarea
                meta={fields.bio}
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
                {...props}
              />
              <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const FormStory = {
  name: "Form",
  render: (props) => <FormDemo {...props} />,
  decorators: [ToastDecorator],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
} satisfies Story;
