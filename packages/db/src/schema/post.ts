import { sql } from 'drizzle-orm';
import { timestamp, varchar } from 'drizzle-orm/mysql-core';

import { mySqlTable } from './_table';

export const post = mySqlTable('post', {
  id: varchar('id', { length: 255 }).primaryKey(),
  slug: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});
