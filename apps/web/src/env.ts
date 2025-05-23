import { env as authEnv } from "@kkhys/auth/env";
import { env as dbEnv } from "@kkhys/db/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [authEnv, dbEnv, vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().default(3000),
  },
  client: {
    NEXT_PUBLIC_TAG_MANAGER_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1),
  },
  server: {
    GOOGLE_SHEETS_ID: z.string().min(1),
    GCP_CLIENT_EMAIL: z.string().email(),
    GCP_PRIVATE_KEY: z.string().min(1),
    LINE_USER_ID: z.string().min(1),
    LINE_CHANNEL_ACCESS_TOKEN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    VERCEL_DEPLOY_HOOK_URL: z.string().url(),
    CRON_SECRET: z.string().min(1),
    WAKATIME_API_KEY: z.string().min(1),
    MASTODON_API_KEY: z.string().min(1),
    GITHUB_ACCESS_TOKEN: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_TAG_MANAGER_ID,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
