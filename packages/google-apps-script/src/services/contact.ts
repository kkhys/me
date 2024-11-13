import type { z } from 'zod';

import type { ContactSchema } from '@kkhys/validators';

type SendEmailParameters = Parameters<typeof GmailApp.sendEmail>;
type ContactSchemaProps = z.infer<typeof ContactSchema>;

const sheet = SpreadsheetApp.openById(
  import.meta.env.VITE_GOOGLE_SHEETS_ID,
).getActiveSheet();
const lastRow = sheet.getLastRow();

const emailColumn = 1;
const nameColumn = 2;
const typeColumn = 3;
const contentColumn = 4;

export const sendContactEmail = () => {
  const recipient =
    'simplelogin.alibi716@aleeas.com' satisfies SendEmailParameters[0];
  const subject = 'お問い合わせがありました' satisfies SendEmailParameters[1];
  const body = generateBody() satisfies SendEmailParameters[2];
  const options = {
    // from: 'noreply@kkhys.me',
    name: 'Keisuke Hayashi',
    // htmlBody: html,
  } satisfies SendEmailParameters[3];

  const lock = LockService.getScriptLock();
  if (lock.tryLock(1000)) {
    GmailApp.sendEmail(recipient, subject, body, options);
    lock.releaseLock();
  }
};

const generateBody = () => {
  const email = sheet
    .getRange(lastRow, emailColumn)
    .getValue() as ContactSchemaProps['email'];
  const name = sheet
    .getRange(lastRow, nameColumn)
    .getValue() as ContactSchemaProps['name'];
  const type = sheet
    .getRange(lastRow, typeColumn)
    .getValue() as ContactSchemaProps['type'];
  const content = sheet
    .getRange(lastRow, contentColumn)
    .getValue() as ContactSchemaProps['content'];

  return `kkhys.me にお問い合わせがありました。

# 名前
${name}

# メールアドレス
${email}

# お問い合わせ種別
${type}

# お問い合わせ内容
${content}
`;
};
