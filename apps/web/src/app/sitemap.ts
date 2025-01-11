import type { MetadataRoute } from "next";

import { staticSitemap } from "#/share/static-sitemap";

const sitemap = (): MetadataRoute.Sitemap => [...staticSitemap];

export default sitemap;
