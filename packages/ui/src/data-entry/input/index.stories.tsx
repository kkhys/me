import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Button,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  toast,
} from "@kkhys/ui";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { z } from "zod";
import { ToastDecorator } from "../../feedback/toast/index.stories";

const meta = {
  title: "Data Entry / Input",
  component: Input,
  argTypes: {
    placeholder: {
      control: "text",
      description: "The placeholder text when the input is empty.",
      table: {
        type: { summary: "string" },
      },
      type: {
        name: "string",
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
    type: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const fileInputId = "file-input";
const withLabelInputId = "with-label-input";

export const Default = {
  args: {
    type: "email",
    placeholder: "Email",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputElement = canvas.getByRole("textbox");

    await step("Enter email", async () => {
      await userEvent.type(inputElement, "example-email@email.com", {
        delay: 100,
      });
    });
  },
} satisfies Story;

export const Password = {
  args: {
    type: "password",
    placeholder: "Password",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputElement = canvas.getByPlaceholderText("Password");

    await step("Enter password", async () => {
      await userEvent.type(inputElement, "password", {
        delay: 100,
      });
    });
  },
} satisfies Story;

export const File = {
  args: {
    id: fileInputId,
    type: "file",
  },
  decorators: [
    (Story) => (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={fileInputId}>Picture</Label>
        <Story />
      </div>
    ),
  ],
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
    type: "email",
    placeholder: "Email",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputElement = canvas.getByPlaceholderText("Email");

    await step("Verify input field is disabled", async () => {
      await expect(inputElement).toBeDisabled();
      await userEvent.type(inputElement, "test@example.com");
      await expect(inputElement).not.toHaveValue("test@example.com");
      inputElement.focus();
      await expect(inputElement).not.toHaveFocus();
    });
  },
} satisfies Story;

export const WithLabel = {
  args: {
    id: withLabelInputId,
    type: "email",
    placeholder: "Email",
  },
  decorators: [
    (Story) => (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={withLabelInputId}>Email</Label>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const inputElement = canvas.getByLabelText("Email");

    await step("Focus and type an email", async () => {
      inputElement.focus();
      await expect(inputElement).toHaveFocus();
      await userEvent.type(inputElement, "test@example.com");
      await expect(inputElement).toHaveValue("test@example.com");
    });

    await step("Clear the entered email", async () => {
      await userEvent.clear(inputElement);
      await expect(inputElement).toHaveValue("");
    });
  },
} satisfies Story;

export const WithButton = {
  args: {
    type: "email",
    placeholder: "Email",
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Story />
        <Button type="submit">Send</Button>
      </div>
    ),
  ],
} satisfies Story;

const FormDemo = (props: React.ComponentProps<typeof Input>) => {
  const FormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
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
                {JSON.stringify(formData.get("username"), null, 2)}
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
          name={fields.username.name}
          render={() => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input meta={fields.username} {...props} />
              <FormDescription>
                This is your public display name.
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
  args: {
    id: withLabelInputId,
    type: "text",
    placeholder: "username",
  },
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
