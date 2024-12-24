import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { ArticleList, CategoryNav, Pagination } from "#/app/(app)/posts/_ui";
import { itemsPerPage, siteConfig } from "#/config";
import { getPublicPosts } from "#/utils/post";

const JsonLd = () => {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/posts`,
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdBreadcrumb),
      }}
    />
  );
};

export const metadata = {
  title: "Blog",
  description: "Blog posts of Keisuke Hayashi.",
  alternates: {
    canonical: "/posts/page/1",
  },
  openGraph: {
    url: "/posts/page/1",
  },
} satisfies Metadata;

const Page = () => {
  const allPosts = getPublicPosts();
  const totalPages = Math.ceil(allPosts.length / itemsPerPage);
  const currentPosts = allPosts.slice(0, itemsPerPage);

  return (
    <>
      <JsonLd />
      <header>
        <h1 className="font-sans font-medium">Blog</h1>
        <CategoryNav className="mt-6" />
      </header>
      <div className="mt-6">
        <ArticleList posts={currentPosts} />
      </div>
      <Pagination
        className="mt-12"
        path="/posts/page"
        totalPages={totalPages}
        currentPage={1}
      />
    </>
  );
};

export default Page;
