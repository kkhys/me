import { format } from 'date-fns';

import { ContactSchema } from '@kkhys/validators';

import { env } from '../../env';
import { contactMail } from '../mail-templates';
import { appendGoogleSheets, sendEmail, sendLineMessage, verifyRecaptcha } from '../services';
import { publicProcedure } from '../trpc';

export const contactRouter = {
  send: publicProcedure.input(ContactSchema).mutation(async ({ input, ctx }) => {
    const { email, name, content, shouldSendReplyMail, recaptchaToken } = input;

    if (!recaptchaToken) {
      throw new Error('Recaptcha token is required');
    }

    const expectedAction = 'contact';
    const recaptchaResponse = await verifyRecaptcha({ recaptchaToken, expectedAction });

    if (!recaptchaResponse.tokenProperties.valid || recaptchaResponse.tokenProperties.action !== expectedAction) {
      throw new Error('Invalid recaptcha token');
    }

    if (recaptchaResponse.riskAnalysis.score < 0.7) {
      throw new Error('Recaptcha score is too low');
    }

    const isProduction = env.NODE_ENV === 'production';
    const sheetName = isProduction ? 'contact' : 'contact-dev';
    const currentDate = format(new Date(), 'yyyy/MM/dd HH:mm:ss');

    await appendGoogleSheets({ sheetName, values: [[email, name, content, currentDate, ctx.ip ?? '']] });

    if (!isProduction) {
      return;
    }

    await sendLineMessage({
      message: `New contact from ${name} <${email}>: ${content}`,
    });

    if (shouldSendReplyMail) {
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting me',
        html: contactMail(input),
        tags: [{ name: 'category', value: 'contact' }],
      });
    }
  }),
};
