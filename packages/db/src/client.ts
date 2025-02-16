import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

export const db = drizzle({
  client: neon(process.env.DATABASE_URL),
  schema,
  casing: "snake_case",
});
