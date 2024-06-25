import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GOOGLE_SHEETS_ID: z.string().min(1),
    GCP_CLIENT_EMAIL: z.string().min(1),
    GCP_PRIVATE_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
