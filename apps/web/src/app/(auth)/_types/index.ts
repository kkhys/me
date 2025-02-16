export type ClerkWebhookUser = {
  data: {
    id: string;
    email_addresses: {
      id: string;
      email_address: string;
    }[];
    primary_email_address_id: string;
  };
};
