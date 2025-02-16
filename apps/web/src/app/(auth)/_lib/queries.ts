import "server-only";

import { eq } from "@kkhys/db";
import { db } from "@kkhys/db/client";
import { type SelectUser, User } from "@kkhys/db/schema";

export const getUserByClerkId = async (clerkId: SelectUser["clerkId"]) => {
  const user = await db
    .select()
    .from(User)
    .where(eq(User.clerkId, clerkId))
    .limit(1);
  return user[0] || null;
};
