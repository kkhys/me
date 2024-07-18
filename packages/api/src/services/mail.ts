import { Resend } from 'resend';

import { env } from '../../env';

const resend = new Resend(env.RESEND_API_KEY);
const administrator = {
  name: 'Keisuke Hayashi',
  email: 'noreply@kkhys.me',
};

export const sendEmail = async ({
  to,
  subject,
  html,
  tags,
}: {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
}) => {
  const { data, error } = await resend.emails.send({
    from: `${administrator.name} <${administrator.email}>`,
    to,
    subject,
    html,
    tags,
    headers: {
      'X-Entity-Ref-ID': new Date().getTime().toString(),
    },
  });

  if (error) {
    throw new Error(`Failed to send email to ${to}. Error: ${JSON.stringify(error)}`);
  }

  console.log(`Successfully sent email to ${to}. Response: ${JSON.stringify(data)}`);
};
