import { EventSchemas, Inngest } from "inngest";
import type { ClerkWebhookUser } from "#/app/(auth)/_types";

type Events = {
  "clerk/user.created": ClerkWebhookUser;
  "clerk/user.updated": ClerkWebhookUser;
  "clerk/user.deleted": ClerkWebhookUser;
};

export const inngest = new Inngest({
  id: "me",
  schemas: new EventSchemas().fromRecord<Events>(),
});
