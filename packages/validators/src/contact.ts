import { z } from 'zod';

export const ContactSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .max(255, { message: 'メールアドレスは 255 文字以内で入力してください' })
    .email({ message: 'メールアドレスの形式が正しくありません' }),
  name: z
    .string()
    .min(1, { message: '名前を入力してください' })
    .max(255, { message: '名前は 255 文字以内で入力してください' }),
  type: z.enum(
    [
      'jobScouting',
      'projectConsultation',
      'feedback',
      'collaboration',
      'other',
    ],
    {
      message: 'お問い合わせ種別を選択してください',
    },
  ),
  content: z
    .string()
    .min(1, { message: 'お問い合わせ内容を入力してください' })
    .max(2000, {
      message: 'お問い合わせ内容は 2000 文字以内で入力してください',
    }),
  shouldSendReplyMail: z.boolean(),
  recaptchaToken: z.string().optional(),
});
