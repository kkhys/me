import type { Config } from 'drizzle-kit';

import { connectionString } from '.';

export default {
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: { url: connectionString },
  tablesFilter: ['me_*'],
  out: './src/schema/migrations',
} satisfies Config;
