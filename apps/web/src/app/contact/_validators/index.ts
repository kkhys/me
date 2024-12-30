import { z } from "zod";
import { typeValues } from "#/app/contact/_config";

export const ContactSchema = z.object({
  email: z
    .string({ required_error: "メールアドレスを入力してください" })
    .max(255, { message: "メールアドレスは 255 文字以内で入力してください" })
    .email({ message: "メールアドレスの形式が正しくありません" }),
  name: z
    .string({ required_error: "名前を入力してください" })
    .max(255, { message: "名前は 255 文字以内で入力してください" }),
  type: z.enum(typeValues as [string, ...string[]], {
    message: "お問い合わせ種別を選択してください",
  }),
  content: z
    .string({ required_error: "お問い合わせ内容を入力してください" })
    .max(2000, {
      message: "お問い合わせ内容は 2000 文字以内で入力してください",
    }),
  shouldSendReplyMail: z.boolean().default(false),
});
