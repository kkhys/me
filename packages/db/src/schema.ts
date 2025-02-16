import { pgTable } from "drizzle-orm/pg-core";

export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  clerkId: t.varchar({ length: 255 }).notNull().unique(),
  deletedAt: t.timestamp(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t.timestamp({ withTimezone: true }).$onUpdateFn(() => new Date()),
}));

export type InsertUser = typeof User.$inferInsert;
export type SelectUser = typeof User.$inferSelect;
