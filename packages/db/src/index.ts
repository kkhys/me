import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { post } from './schema';

export const schema = { ...post };

export { pgTable as tableCreator } from './schema';

export * from 'drizzle-orm';

export const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
