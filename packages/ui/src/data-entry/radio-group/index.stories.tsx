import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  RadioGroup,
  toast,
} from "@kkhys/ui";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import * as React from "react";
import { z } from "zod";
import { ToastDecorator } from "../../feedback/toast/index.stories";
import { _RadioGroup, _RadioGroupItem } from "./_radio-group";

const meta = {
  title: "Data Entry / Radio Group",
  component: _RadioGroup,
  argTypes: {
    onValueChange: {
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
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof _RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    defaultValue: "comfortable",
    children: (
      <>
        <div className="flex items-center space-x-2">
          <_RadioGroupItem value="default" id="r1" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div className="flex items-center space-x-2">
          <_RadioGroupItem value="comfortable" id="r2" />
          <Label htmlFor="r2">Comfortable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <_RadioGroupItem value="compact" id="r3" />
          <Label htmlFor="r3">Compact</Label>
        </div>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const defaultRadio = canvas.getByLabelText("Default");
    const comfortableRadio = canvas.getByLabelText("Comfortable");
    const compactRadio = canvas.getByLabelText("Compact");

    await step("Verify the default selected value", async () => {
      await expect(defaultRadio).not.toBeChecked();
      await expect(comfortableRadio).toBeChecked();
      await expect(compactRadio).not.toBeChecked();
    });

    await step("Select Default option", async () => {
      await userEvent.click(defaultRadio, { delay: 100 });

      await expect(defaultRadio).toBeChecked();
      await expect(comfortableRadio).not.toBeChecked();
      await expect(compactRadio).not.toBeChecked();
    });
  },
} satisfies Story;

const FormDemo = () => {
  const typeOptions = [
    {
      value: "all",
      label: "All new messages",
    },
    {
      value: "mentions",
      label: "Direct messages and mentions",
    },
    {
      value: "none",
      label: "Nothing",
    },
  ];

  const FormSchema = z.object({
    type: z.enum(
      typeOptions.map((option) => option.value) as [string, ...string[]],
      {
        required_error: "You need to select a notification type.",
      },
    ),
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
                {JSON.stringify(formData.get("type"), null, 2)}
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
      <form className="w-[300px] space-y-6" {...getFormProps(form)}>
        <FormField
          name={fields.type.name}
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <RadioGroup meta={fields.type} items={typeOptions} />
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
  render: () => <FormDemo />,
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
