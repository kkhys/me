import type { CollectionEntry } from "astro:content";
import type { BlogPosting, Person, WebSite, WithContext } from "schema-dts";

import { me, siteConfig } from "#/config/site.ts";
import { getCategoryByTitle } from "#/features/blog/config/category";
import { getTagByTitle } from "#/features/blog/config/tag";

const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: me.name,
  url: import.meta.env.SITE,
  image: `${import.meta.env.SITE}/images/avatar.jpg`,
  sameAs: [me.mastodon],
  jobTitle: "Software engineer",
  worksFor: {
    "@type": "Organization",
    name: "RevComm, Inc.",
    url: "https://www.revcomm.co.jp",
  },
};

export const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: import.meta.env.SITE,
  name: siteConfig.title,
  description: siteConfig.description,
  inLanguage: "ja_JP",
};

export const getBlogPostingSchema = ({
  id,
  data,
}: Pick<CollectionEntry<"blog">, "id" | "data">): WithContext<BlogPosting> => {
  const categoryObject = getCategoryByTitle(data.category);

  if (!categoryObject) {
    throw new Error(`Category not found: ${data.category}`);
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    url: `${import.meta.env.SITE}/blog/posts/${id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${import.meta.env.SITE}/blog/posts/${id}`,
    },
    image: {
      "@type": "ImageObject",
      url: `${import.meta.env.SITE}/api/og/${id}.png`,
    },
    description: data.description,
    publisher: personSchema,
    author: personSchema,
    datePublished: data.publishedAt.toISOString(),
    dateModified:
      data.updatedAt?.toISOString() ?? data.publishedAt.toISOString(),
    articleSection: categoryObject.label,
    ...(data.tags && {
      keywords: data.tags
        .map((tag) => getTagByTitle(tag)?.label || tag)
        .join(", "),
    }),
    inLanguage: "ja-JP",
  };
};
