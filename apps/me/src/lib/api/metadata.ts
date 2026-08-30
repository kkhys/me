import { NODE_ENV } from "astro:env/client";
import { createMetadataFetcher } from "@kkhys/ui/link-metadata";

// Dev servers and CI builds never hit the network for link cards.
export const getMetadata = createMetadataFetcher({
  enabled: NODE_ENV === "production" && !process.env.CI,
});
