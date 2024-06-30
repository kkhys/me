import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { env as authEnv } from '@kkhys/auth/env';

export const env = createEnv({
  extends: [authEnv],
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CI: z.boolean().default(false),
  },
  server: {
    GOOGLE_MAPS_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',
});
