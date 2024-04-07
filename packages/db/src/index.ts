import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { auth, post } from './schema';

export const schema = { ...auth, ...post };

export { pgTable as tableCreator } from './schema';

export * from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const connectionString = process.env.DATABASE_URL;

const client = neon(connectionString);

export const db = drizzle(client, { schema });
