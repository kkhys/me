import { NODE_ENV, PUBLIC_DEPLOY_ENV } from "astro:env/client";
import { createMetadataFetcher } from "@kkhys/ui/link-metadata";

// Only the production deploy fetches real metadata; previews and dev get the
// placeholder card.
export const getMetadata = createMetadataFetcher({
  enabled: NODE_ENV === "production" && PUBLIC_DEPLOY_ENV === "production",
  placeholder: {
    title: "Link",
    description: "External link",
    image: undefined,
    icon: undefined,
  },
});
