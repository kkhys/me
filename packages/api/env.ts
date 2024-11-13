import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GOOGLE_SHEETS_ID: z.string().min(1),
    GCP_CLIENT_EMAIL: z.string().min(1),
    GCP_PRIVATE_KEY: z.string().min(1),
    GCP_PROJECT_ID: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    LINE_USER_ID: z.string().min(1),
    LINE_CHANNEL_ACCESS_TOKEN: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    RECAPTCHA_SITE_KEY: z.string().min(1),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
