import type { AnyColumn } from '@kkhys/db';
import { sql } from '@kkhys/db';

export const increment = (column: AnyColumn, value = 1) =>
  sql`${column} + ${value}`;
