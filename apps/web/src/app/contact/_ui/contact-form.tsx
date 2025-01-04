"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Button,
  Checkbox,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  Textarea,
  cn,
  toast,
} from "@kkhys/ui";
import { ContactSchema, contactTypeOptions } from "@kkhys/validators";
import { useActionState } from "react";
import * as React from "react";
import { sendContract } from "#/app/contact/_lib";

export const ContactForm = ({
  className,
}: {
  className?: string;
}) => {
  const [lastResult, action, isPending] = useActionState(
    sendContract,
    undefined,
  );
  const [form, fields] = useForm({
    id: "contact",
    lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ContactSchema }),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    constraint: getZodConstraint(ContactSchema),
  });

  React.useEffect(() => {
    if (lastResult?.status === "success") {
      toast.success("お問い合わせを受け付けました。");
    }
  }, [lastResult?.status]);

  React.useEffect(() => {
    if (form.errors) {
      toast.error(form.errors[0]);
    }
  }, [form.errors]);

  return (
    <Form context={form.context}>
      <form
        action={action}
        className={cn("space-y-8", className)}
        {...getFormProps(form)}
      >
        <FormField
          name={fields.name.name}
          render={() => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <Input
                type="text"
                autoComplete="name"
                autoCapitalize="off"
                spellCheck={false}
                meta={fields.name}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={fields.email.name}
          render={() => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type="text"
                autoComplete="email"
                autoCapitalize="off"
                spellCheck={false}
                className="font-sans"
                meta={fields.email}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={fields.type.name}
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>お問い合わせ種別</FormLabel>
              <RadioGroup meta={fields.type} items={contactTypeOptions} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={fields.content.name}
          render={() => (
            <FormItem>
              <FormLabel>お問い合わせ内容</FormLabel>
              <Textarea
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                rows={6}
                meta={fields.content}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={fields.shouldSendReplyMail.name}
          render={() => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <Checkbox meta={fields.shouldSendReplyMail} />
              <div className="space-y-1 leading-none">
                <FormLabel className="block">
                  入力したメールアドレス宛に回答のコピーを送信する
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          送信する
        </Button>
      </form>
    </Form>
  );
};
