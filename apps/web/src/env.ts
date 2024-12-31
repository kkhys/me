import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_TAG_MANAGER_ID: z.string().min(1),
  },
  server: {
    GOOGLE_MAPS_API_KEY: z.string().min(1),
    GOOGLE_SHEETS_ID: z.string().min(1),
    GCP_CLIENT_EMAIL: z.string().min(1),
    GCP_PRIVATE_KEY: z.string().min(1),
    LINE_USER_ID: z.string().min(1),
    LINE_CHANNEL_ACCESS_TOKEN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_TAG_MANAGER_ID,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
