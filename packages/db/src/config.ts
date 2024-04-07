import type { Config } from 'drizzle-kit';

import { connectionString } from '.';

export default {
  schema: './src/schema',
  driver: 'pg',
  dbCredentials: { connectionString },
  tablesFilter: ['me_*'],
  out: './src/schema/migrations',
} satisfies Config;
