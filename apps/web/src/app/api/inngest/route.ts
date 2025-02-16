import { serve } from "inngest/next";
import {
  syncCreatedUser,
  syncDeletedUser,
  syncUpdatedUser,
} from "#/app/(auth)/_lib";
import { inngest } from "#/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncCreatedUser, syncUpdatedUser, syncDeletedUser],
});
