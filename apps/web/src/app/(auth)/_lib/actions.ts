"use server";

import { eq } from "@kkhys/db";
import { db } from "@kkhys/db/client";
import { type InsertUser, type SelectUser, User } from "@kkhys/db/schema";

export const createUser = async (data: InsertUser) =>
  await db.insert(User).values(data);

export const updateUser = async (
  id: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id">>,
) => await db.update(User).set(data).where(eq(User.id, id));

export const updateUserByClerkId = async (
  clerkId: SelectUser["clerkId"],
  data: Partial<Omit<SelectUser, "id" | "clerkId">>,
) => await db.update(User).set(data).where(eq(User.clerkId, clerkId));

export const deleteUserByClerkId = async (clerkId: SelectUser["clerkId"]) =>
  await db
    .update(User)
    .set({ deletedAt: new Date() })
    .where(eq(User.clerkId, clerkId));
