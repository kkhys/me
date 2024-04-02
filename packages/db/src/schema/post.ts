import { integer, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';

export const posts = pgTable(
  'post',
  {
    slug: varchar('slug', { length: 255 }).primaryKey(),
    views: integer('views').default(0).notNull(),
    likes: integer('likes').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  ({ slug }) => ({
    slugIdx: uniqueIndex('slug_idx').on(slug),
  }),
);
