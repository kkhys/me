import type { CollectionEntry } from "astro:content";
import type { BlogPosting, Person, WebSite, WithContext } from "schema-dts";

import { me, siteConfig } from "#/config/site";
import { BASE_URL } from "#/utils/base-url";
import { getCategoryByTitle } from "#/features/blog/config/category";
import { getTagByTitle } from "#/features/blog/config/tag";

const personSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: me.name,
  url: BASE_URL,
  image: `${BASE_URL}/images/avatar.jpg`,
  sameAs: [me.memo],
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
  url: BASE_URL,
  name: siteConfig.title,
  description: siteConfig.description,
  inLanguage: "ja_JP",
};

export const getBlogPostingSchema = ({
  id,
  data,
  description,
}: Pick<CollectionEntry<"blog">, "id" | "data"> & {
  description: string;
}): WithContext<BlogPosting> => {
  const categoryObject = getCategoryByTitle(data.category);

  if (!categoryObject) {
    throw new Error(`Category not found: ${data.category}`);
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    url: `${BASE_URL}/blog/posts/${id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/posts/${id}`,
    },
    image: {
      "@type": "ImageObject",
      url: `${BASE_URL}/api/og/${id}.png`,
    },
    description,
    publisher: personSchema,
    author: personSchema,
    datePublished: data.publishedAt.toISOString(),
    dateModified: data.updatedAt?.toISOString() ?? data.publishedAt.toISOString(),
    articleSection: categoryObject.label,
    ...(data.tags && {
      keywords: data.tags.map((tag) => getTagByTitle(tag)?.label || tag).join(", "),
    }),
    inLanguage: "ja-JP",
  };
};
