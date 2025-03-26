import { serve } from "inngest/next";
import {
  syncCreatedUser,
  syncDeletedUser,
  syncUpdatedUser,
} from "#/app/(auth)/_lib/sync-user";
import { inngest } from "#/lib/inngest/client";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncCreatedUser, syncUpdatedUser, syncDeletedUser],
});
