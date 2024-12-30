"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { ContactSchema } from "#/app/contact/_validators";

export const sendContract = async (_prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: ContactSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  console.log("email:", submission.value.email);
  console.log("name: ", submission.value.name);
  console.log("type: ", submission.value.type);
  console.log("content: ", submission.value.content);

  console.log("send contract");

  redirect("/contact");
};
