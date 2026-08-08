export const externalSites = ["Hatena", "note", "Zenn"] as const;
export type ExternalSite = (typeof externalSites)[number];
