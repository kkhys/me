'use client';

import type { Control } from 'react-hook-form';
import type { z } from 'zod';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm, useWatch } from 'react-hook-form';

import {
  Button,
  Checkbox,
  cn,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  toast,
} from '@kkhys/ui';
import { ContactSchema } from '@kkhys/validators';

import { api } from '#/lib/trpc/react';

type ContactFormValues = z.infer<typeof ContactSchema>;

const WordCounter = ({
  name,
  control,
  children,
}: {
  name: keyof ContactFormValues;
  control: Control<ContactFormValues>;
  children: (count: number) => React.ReactNode;
}) => {
  const value = useWatch({ name, control }) as string;
  const count = value.length;
  return <>{children(count)}</>;
};

export const ContactForm = ({ className }: { className?: string }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { mutateAsync } = api.contact.send.useMutation();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      email: '',
      name: '',
      content: '',
      shouldSendReplyMail: false,
    },
    mode: 'onBlur',
  });

  const handleReCaptchaVerify = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    return await executeRecaptcha('contact');
  };

  const onSubmit = async (data: ContactFormValues) => {
    const { email, name, content, shouldSendReplyMail } = data;
    const recaptchaToken = await handleReCaptchaVerify();

    if (!recaptchaToken) {
      return;
    }

    await mutateAsync({ email, name, content, shouldSendReplyMail, recaptchaToken });

    form.reset();

    toast.success('お問い合わせを受け付けました。');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-8', className)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>名前</FormLabel>
              <FormControl>
                <Input autoComplete='name' autoCapitalize='off' spellCheck={false} required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  autoComplete='email'
                  autoCapitalize='off'
                  spellCheck={false}
                  required
                  className='font-sans'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel required>お問い合わせ内容</FormLabel>
              <FormControl>
                <Textarea autoComplete='off' autoCapitalize='off' spellCheck={false} required rows={6} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                <WordCounter name='content' control={form.control}>
                  {(count) => <span>{count} / 2000</span>}
                </WordCounter>
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='shouldSendReplyMail'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
              <FormControl>
                <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='block'>入力したメールアドレス宛に回答のコピーを送信する</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <div>
          <Button disabled={form.formState.isSubmitting}>送信する</Button>
          <div className='prose dark:prose-invert'>
            <p className='mt-3 text-xs text-muted-foreground'>
              このサイトは reCAPTCHA によって保護されており、
              <a href='https://policies.google.com/privacy' target='_blank' rel='noopener noreferrer'>
                Google プライバシーポリシー
              </a>
              と
              <a href='https://policies.google.com/terms' target='_blank' rel='noopener noreferrer'>
                利用規約
              </a>
              が適用されます。
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
};