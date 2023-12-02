import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  shared: {},
  server: {
    ME_REPOSITORY_URL: z.string().url(),
    BLOG_CONTENTS_REPOSITORY_URL: z.string().url(),
  },
  runtimeEnv: {
    ME_REPOSITORY_URL: process.env.ME_REPOSITORY_URL,
    BLOG_CONTENTS_REPOSITORY_URL: process.env.BLOG_CONTENTS_REPOSITORY_URL,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',
});
