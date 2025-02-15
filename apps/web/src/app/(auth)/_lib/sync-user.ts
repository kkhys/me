import { inngest } from "#/lib/inngest";

export const syncCreatedUser = inngest.createFunction(
  { id: "sync-created-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const user = event.data;
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      primary_email_address_id,
    } = user;
    const email =
      email_addresses.find(({ id }) => id === primary_email_address_id)
        ?.email_address ?? "";
    console.log("Syncing created user", { id, email, first_name, last_name });
  },
);

export const syncUpdatedUser = inngest.createFunction(
  { id: "sync-updated-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const user = event.data;
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      primary_email_address_id,
    } = user;
    const email =
      email_addresses.find(({ id }) => id === primary_email_address_id)
        ?.email_address ?? "";
    console.log("Syncing updated user", { id, email, first_name, last_name });
  },
);

export const syncDeletedUser = inngest.createFunction(
  { id: "sync-deleted-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const user = event.data;
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      primary_email_address_id,
    } = user;
    const email =
      email_addresses.find(({ id }) => id === primary_email_address_id)
        ?.email_address ?? "";
    console.log("Syncing deleted user", { id, email, first_name, last_name });
  },
);
