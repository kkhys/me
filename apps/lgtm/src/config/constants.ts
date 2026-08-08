export const TITLE = "LGTM" as const;
export const TWITTER_ACCOUNT_NAME = "@kkhys_" as const;
export const IMAGES_PER_PAGE = 20 as const;
// Embed snippets are copied into external sites, so they need the canonical
// production origin, not the current one (which would be localhost in dev).
export const SITE_URL = "https://lgtm.kkhys.me" as const;
