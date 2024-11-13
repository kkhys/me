import type { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { format } from 'date-fns';

import { contactMail } from '@kkhys/email';
import { ContactSchema } from '@kkhys/validators';

import { env } from '../../env';
import { CustomTrpcError, EmailError, RecaptchaError } from '../exceptions';
import {
  appendGoogleSheets,
  sendEmail,
  sendLineMessage,
  verifyRecaptcha,
} from '../services';
import { publicProcedure } from '../trpc';
import { getIpHash, rateLimiter } from '../utils';

export const contactRouter = {
  send: publicProcedure
    .input(ContactSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.ip) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const ip = ctx.ip;
      const ipHash = await getIpHash(ip);
      const { success } = await rateLimiter(1, '1 m').limit(ipHash);

      if (!success) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
      }

      const {
        email,
        name,
        type,
        content,
        shouldSendReplyMail,
        recaptchaToken,
      } = input;

      if (!recaptchaToken) {
        throw new RecaptchaError('Recaptcha token is required');
      }

      const expectedAction = 'contact';
      const recaptchaResponse = await verifyRecaptcha({
        recaptchaToken,
        expectedAction,
      });

      if (
        !recaptchaResponse.tokenProperties.valid ||
        recaptchaResponse.tokenProperties.action !== expectedAction
      ) {
        throw new RecaptchaError('Invalid recaptcha token');
      }

      if (recaptchaResponse.riskAnalysis.score < 0.7) {
        throw new RecaptchaError('Recaptcha score is too low');
      }

      const isProduction = env.NODE_ENV === 'production';
      const sheetName = isProduction ? 'contact' : 'contact-dev';
      const currentDate = format(new Date(), 'yyyy/MM/dd HH:mm:ss');

      await appendGoogleSheets({
        sheetName,
        values: [[email, name, type as string, content, currentDate, ip ?? '']],
      });

      if (!isProduction) {
        return;
      }

      try {
        await sendLineMessage({
          message: generateLineMessage(input),
        });
      } catch (error) {
        console.error('Failed to send a message to LINE: ', error);
      }

      if (shouldSendReplyMail) {
        try {
          await sendEmail({
            to: email,
            subject: 'Thank you for contacting me',
            body: contactMail(input) as unknown as Record<
              'html' | 'text',
              string
            >,
            tags: [{ name: 'category', value: 'contact' }],
          });
        } catch (error) {
          console.error('Failed to send a reply email: ', error);
          const errorMessage = 'Failed to send a reply email';
          throw new CustomTrpcError(errorMessage, new EmailError(errorMessage));
        }
      }
    }),
};

const generateLineMessage = (input: z.infer<typeof ContactSchema>) => {
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
