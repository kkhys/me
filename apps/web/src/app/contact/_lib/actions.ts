"use server";

import { parseWithZod } from "@conform-to/zod";
import { rateLimiter } from "@kkhys/db";
import { contactMail } from "@kkhys/email";
import { ContactSchema } from "@kkhys/validators";
import { format } from "date-fns";
import { google } from "googleapis";
import { headers } from "next/headers";
import type { z } from "zod";
import { env } from "#/env";
import { getIpHash } from "#/utils/ip";

export const sendContract = async (_prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: ContactSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const ip = (await headers()).get("X-Forwarded-For");

  if (!ip) {
    console.error("IP address not found");
    return submission.reply({
      formErrors: ["IP アドレスが取得できませんでした。"],
    });
  }

  // const ipHash = await getIpHash(ip);
  // const { success } = await rateLimiter(1, "1 m").limit(ipHash);
  //
  // if (!success) {
  //   console.info("Rate limit exceeded");
  //   return submission.reply({
  //     formErrors: [
  //       "お問い合わせの送信回数が上限に達しました。しばらくしてから再度お試しください。",
  //     ],
  //   });
  // }

  const { email, name, type, content, shouldSendReplyMail } = submission.value;

  const isProduction = env.NODE_ENV === "production";
  const sheetName = isProduction ? "contact" : "contact-dev";
  const currentDate = format(new Date(), "yyyy/MM/dd HH:mm:ss");

  try {
    await appendGoogleSheets({
      sheetName,
      values: [[email, name, type, content, currentDate, ip ?? ""]],
    });
  } catch (error) {
    return submission.reply({
      formErrors: [
        "サーバーエラーが発生しました。しばらくしてから再度お試しください。",
      ],
    });
  }

  if (!isProduction) {
    return;
  }

  try {
    await sendLineMessage({
      message: generateLineMessage(submission.value),
    });
  } catch (error) {
    console.error("Failed to send a message to LINE: ", error);
  }

  if (shouldSendReplyMail) {
    try {
      await sendEmail({
        to: email,
        subject: "Thank you for contacting me",
        body: contactMail(submission.value) as unknown as Record<
          "html" | "text",
          string
        >,
        tags: [{ name: "category", value: "contact" }],
      });
    } catch (error) {
      console.error("Failed to send a reply email: ", error);
      return submission.reply({
        formErrors: [
          "お問い合わせは正常に送信されましたが、メールの送信に失敗しました。",
        ],
      });
    }
  }

  return submission.reply();
};

const appendGoogleSheets = async ({
  sheetName,
  values,
}: {
  sheetName: string;
  values: string[][];
}) => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GCP_CLIENT_EMAIL,
      private_key: env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  if (!auth) {
    console.error("Failed to authenticate with Google Sheets");
    throw new Error();
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_ID,
      range: `${sheetName}!A2`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log("Append to Google Sheets was successful:", response);
  } catch (error) {
    console.error("Append to Google Sheets failed:", error);
    throw error;
  }
};

const generateLineMessage = (
  input: Omit<z.infer<typeof ContactSchema>, "shouldSendReplyMail">,
) => {
  const { email, name, type, content } = input;

  return `New Contact.

# Name
${name}

# Email
${email}

# Type
${type}

# Content
${content}`;
};

const sendLineMessage = async ({ message }: { message: string }) => {
  console.log("sendLineMessage", message);
};

const sendEmail = async ({
  to,
  subject,
  body: { html, text },
  tags,
}: {
  to: string;
  subject: string;
  body: Record<"html" | "text", string>;
  tags?: { name: string; value: string }[];
}) => {
  console.log("sendEmail", to, subject, html, text, tags);
};
