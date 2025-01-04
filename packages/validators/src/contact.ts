import { z } from "zod";

export const contactTypeOptions = [
  {
    value: "jobScouting",
    label: "転職スカウト",
  },
  {
    value: "projectConsultation",
    label: "案件のご相談",
  },
  {
    value: "feedback",
    label: "記事のフィードバック",
  },
  {
    value: "collaboration",
    label: "コラボレーションの提案",
  },
  {
    value: "other",
    label: "その他",
  },
];

const contactTypeValues = contactTypeOptions.map((option) => option.value);

export const ContactSchema = z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください" })
    .max(255, { message: "メールアドレスは 255 文字以内で入力してください" })
    .email({ message: "メールアドレスの形式が正しくありません" }),
  name: z
    .string({ required_error: "名前を入力してください" })
    .max(255, { message: "名前は 255 文字以内で入力してください" }),
  type: z.enum(contactTypeValues as [string, ...string[]], {
    message: "お問い合わせ種別を選択してください",
  }),
  content: z
    .string({ required_error: "お問い合わせ内容を入力してください" })
    .max(2000, {
      message: "お問い合わせ内容は 2000 文字以内で入力してください",
    }),
  shouldSendReplyMail: z.boolean().default(false),
});
