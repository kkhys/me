import { format } from 'date-fns';

import { SendContactSchema } from '@kkhys/validators';

import { env } from '../../env';
import { contactMail } from '../mail-templates';
import { appendGoogleSheets, sendEmail, sendLineMessage } from '../services';
import { publicProcedure } from '../trpc';

export const contactRouter = {
  send: publicProcedure.input(SendContactSchema).mutation(async ({ input }) => {
    const { email, name, content } = input;
    const isProduction = env.NODE_ENV === 'production';
    const sheetName = isProduction ? 'contact' : 'contact-dev';
    const currentDate = format(new Date(), 'yyyy/MM/dd HH:mm:ss');

    await appendGoogleSheets({ sheetName, values: [[email, name, content, currentDate]] });

    if (!isProduction) {
      return;
    }

    await sendLineMessage({
      message: `New contact from ${name} <${email}>: ${content}`,
    });

    await sendEmail({
      to: email,
      subject: 'Thank you for contacting me',
      html: contactMail(input),
      tags: [{ name: 'category', value: 'contact' }],
    });
  }),
};
