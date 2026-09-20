import { NODE_ENV, PUBLIC_DEPLOY_ENV } from "astro:env/client";
import { createMetadataFetcher } from "@kkhys/ui/link-metadata";
import { readLinkMetadata } from "./link-metadata-cache";

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
  // Resolved locally and committed to memo-content, so an unattended CI deploy
  // never bakes a half-empty card into a static page.
  preloaded: readLinkMetadata(),
});
