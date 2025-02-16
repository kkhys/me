import { createUser, deleteUserByClerkId } from "#/app/(auth)/_lib/actions";
import { getUserByClerkId } from "#/app/(auth)/_lib/queries";
import type { ClerkWebhookUser } from "#/app/(auth)/_types";
import { inngest } from "#/lib/inngest";

export const syncCreatedUser = inngest.createFunction(
  { id: "sync-created-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, email_addresses, primary_email_address_id } = event.data;
    const email = getPrimaryEmailAddress({
      email_addresses,
      primary_email_address_id,
    });

    console.log("Syncing created user", { id, email });

    await createUser({ clerkId: id });
  },
);

export const syncUpdatedUser = inngest.createFunction(
  { id: "sync-updated-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, email_addresses, primary_email_address_id } = event.data;
    const email = getPrimaryEmailAddress({
      email_addresses,
      primary_email_address_id,
    });

    const user = await getUserByClerkId(id);

    if (!user) {
      await createUser({ clerkId: id });
    }

    console.log("Syncing updated user", { id, email });
  },
);

export const syncDeletedUser = inngest.createFunction(
  { id: "sync-deleted-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id, email_addresses, primary_email_address_id } = event.data;
    const email = getPrimaryEmailAddress({
      email_addresses,
      primary_email_address_id,
    });

    console.log("Syncing deleted user", { id, email });

    await deleteUserByClerkId(id);
  },
);

const getPrimaryEmailAddress = ({
  email_addresses,
  primary_email_address_id,
}: Pick<
  ClerkWebhookUser["data"],
  "email_addresses" | "primary_email_address_id"
>) =>
  email_addresses.find(({ id }) => id === primary_email_address_id)
    ?.email_address ?? "no email";
