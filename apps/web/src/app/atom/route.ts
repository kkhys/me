import { Feed } from "feed";

import { me, siteConfig } from "#/config";
import { getPublicPostMetadata } from "#/utils/post";

export const revalidate = 86400;

export const GET = () => {
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: new URL(siteConfig.url).toString(),
    link: new URL(siteConfig.url).toString(),
    image: new URL("opengragh-image", siteConfig.url).toString(),
    favicon: new URL("icon", siteConfig.url).toString(),
    copyright: "CC BY-NC-SA 4.0 2023-PRESENT © Keisuke Hayashi",
    author: {
      name: me.name,
      email: me.email,
      link: new URL(siteConfig.url).toString(),
    },
  });

  for (const { title, slug, excerpt, publishedAt } of getPublicPostMetadata()) {
    feed.addItem({
      title,
      id: new URL(`posts/${slug}`, siteConfig.url).toString(),
      link: new URL(`posts/${slug}`, siteConfig.url).toString(),
      description: excerpt,
      author: [
        {
          name: me.name,
          email: me.email,
          link: new URL(siteConfig.url).toString(),
        },
      ],
      date: new Date(publishedAt),
      image: new URL(
        `/posts/${slug}/opengraph-image/default`,
        siteConfig.url,
      ).toString(),
    });
  }

  const atom = feed.atom1();

  return new Response(atom, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
