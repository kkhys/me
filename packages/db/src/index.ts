import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import { post } from './schema';

export const schema = { ...post };

export { mySqlTable as tableCreator } from './schema';

export * from 'drizzle-orm';

const psClient = new Client({
  host: process.env.DB_HOST!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
});

export const db = drizzle(psClient, { schema });
