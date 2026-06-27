const externalSitesConst = ["Hatena", "note", "Zenn"] as const;
export type ExternalSite = (typeof externalSitesConst)[number];
export const externalSites: ExternalSite[] = [...externalSitesConst];
