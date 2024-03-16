import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
    PORT: z.coerce.number().default(3000),
    CI: z.boolean().optional(),
  },
  server: {
    GOOGLE_MAPS_API_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    PORT: process.env.PORT,
    CI: process.env.CI,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',
});
