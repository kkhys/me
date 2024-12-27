"use server";

import { redis } from "@kkhys/db";
import { headers } from "next/headers";
import { env } from "#/env";

export const incrementViews = async ({
  slug,
}: {
  slug: string;
}) => {
  const ip = (await headers()).get("X-Forwarded-For");

  if (!ip) {
    return;
  }

  const ipHash = await getIpHash(ip);

  const isNew = await redis.set(["deduplicate", ipHash, slug].join(":"), true, {
    nx: true,
    ex: 3,
  });

  if (!isNew) {
    return;
  }

  await redis.incr(["pageviews", env.NODE_ENV, slug].join(":"));
};

const getIpHash = async (ip: string) => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
