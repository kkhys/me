import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { ArticleList, CategoryNav, Pagination } from "#/app/(app)/posts/_ui";
import { itemsPerPage, siteConfig } from "#/config";
import { getPublicPosts } from "#/utils/post";

const JsonLd = ({
  currentPage,
}: {
  currentPage: number;
}) => {
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
        name: `Blog Page ${currentPage}`,
        item: `${siteConfig.url}/posts/page/${currentPage}`,
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

const allPosts = getPublicPosts();
const totalPages = Math.ceil(allPosts.length / itemsPerPage);

const isValidPage = (pageNumber: number): boolean => {
  return pageNumber > 0 && pageNumber <= totalPages;
};

export const generateMetadata = async ({
  params,
}: { params: Promise<{ pageNumber?: string }> }) => {
  const { pageNumber } = await params;

  const currentPage = pageNumber ? Number(pageNumber) : 1;
  const url = `/posts/page/${currentPage}`;

  return {
    title: "Blog",
    description: "Blog posts of Keisuke Hayashi.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
    },
  } satisfies Metadata;
};

export const generateStaticParams = async () =>
  Array.from({ length: totalPages }, (_, i) => ({ pageNumber: String(i + 1) }));

const Page = async ({
  params,
}: { params: Promise<{ pageNumber?: string }> }) => {
  const { pageNumber } = await params;

  const currentPage = pageNumber ? Number(pageNumber) : 1;

  if (Number.isNaN(currentPage) || !isValidPage(currentPage)) {
    notFound();
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentPosts = allPosts.slice(startIndex, endIndex);

  return (
    <>
      <JsonLd currentPage={currentPage} />
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
        currentPage={currentPage}
      />
    </>
  );
};

export default Page;
