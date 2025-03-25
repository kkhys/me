import type { MetadataRoute } from "next";
import { siteConfig } from "#/config/site";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "Yahoo Pipes 1.0",
        disallow: "/",
      },
      {
        userAgent: "008",
        disallow: "/",
      },
      {
        userAgent: "voltron",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "Livelapbot",
        disallow: "/",
      },
      {
        userAgent: "Megalodon",
        disallow: "/",
      },
      {
        userAgent: "ia_archiver",
        disallow: "/",
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
};

export default robots;
