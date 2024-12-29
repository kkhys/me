"use client";

import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
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
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { typeOptions } from "#/app/contact/_config";
import { sendContract } from "#/app/contact/_lib";
import { ContactSchema } from "#/app/contact/_validators";

const SubmitButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
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
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ContactSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    constraint: {
      email: {
        required: true,
      },
      name: {
        required: true,
      },
      type: {
        required: true,
      },
      content: {
        required: true,
      },
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      toast.error(
        "reCAPTCHA が利用できません。しばらくしてから再度お試しください。",
      );
      return;
    }

    return await executeRecaptcha("contact");
  };

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
            </FormItem>
          )}
        />
        <input type="hidden" name="" />
        <div>
          <SubmitButton />
          <div className="prose dark:prose-invert">
            <p className="mt-3 text-xs text-muted-foreground">
              このサイトは reCAPTCHA によって保護されており、
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Google プライバシーポリシー
              </Link>
              と
              <Link
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer"
              >
                利用規約
              </Link>
              が適用されます。
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
};
