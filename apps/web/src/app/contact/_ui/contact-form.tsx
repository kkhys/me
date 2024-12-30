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
  RadioGroupConform,
  Textarea,
  cn,
  toast,
} from "@kkhys/ui";
import { useActionState } from "react";
import * as React from "react";
import { useFormStatus } from "react-dom";
import { typeOptions } from "#/app/contact/_config";
import { sendContract } from "#/app/contact/_lib";
import { ContactSchema } from "#/app/contact/_validators";

const SubmitButton = ({
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      送信する
    </Button>
  );
};

export const ContactForm = ({
  className,
}: {
  className?: string;
}) => {
  const [lastResult, action] = useActionState(sendContract, undefined);
  const [form, fields] = useForm({
    id: "contact",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    constraint: getZodConstraint(ContactSchema),
  });

  React.useEffect(() => {
    if (form.errors) {
      toast.error(form.errors);
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
              <RadioGroupConform meta={fields.type} items={typeOptions} />
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
        <SubmitButton />
      </form>
    </Form>
  );
};
