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
    GOOGLE_MAPS_API_KEY: z.string(),
    DATABASE_URL: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',
});
