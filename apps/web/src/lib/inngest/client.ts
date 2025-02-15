import { EventSchemas, Inngest } from "inngest";

type ClerkUser = {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: {
      id: string;
      email_address: string;
    }[];
    primary_email_address_id: string;
  };
};

type Events = {
  "clerk/user.created": ClerkUser;
  "clerk/user.updated": ClerkUser;
  "clerk/user.deleted": ClerkUser;
};

export const inngest = new Inngest({
  id: "me",
  schemas: new EventSchemas().fromRecord<Events>(),
});
