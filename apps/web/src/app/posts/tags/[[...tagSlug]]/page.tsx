import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { ArticleList } from "#/app/posts/_ui/article-list";
import { Pagination } from "#/app/posts/_ui/pagination";
import { itemsPerPage } from "#/config/constant";
import { siteConfig } from "#/config/site";
import { extractCategoryByTagTitle, flatTags } from "#/config/tag";
import { getPublicPostMetadata, getPublicPosts } from "#/utils/post";

const JsonLd = ({
  tagTitle,
  tagSlug,
  currentPage,
}: {
  tagTitle: string;
  tagSlug: string;
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
        name: `Blog ${tagTitle} Page ${currentPage}`,
        item: `${siteConfig.url}/posts/tags/${tagSlug}/${currentPage}`,
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

const tagPageMap = flatTags.reduce(
  (map, { slug, title }) => {
    const allPosts = getPublicPostMetadata();
    const tagPosts = allPosts.filter(({ tags }) =>
      tags?.includes(title as (typeof tags)[number]),
    );
    map[slug] = Math.ceil(tagPosts.length / itemsPerPage);
    return map;
  },
  {} as Record<string, number>,
);

const isValidPage = (tagSlug: string, pageNumber: number): boolean => {
  const totalPages = tagPageMap[tagSlug];

  if (!totalPages) {
    return false;
  }

  return pageNumber > 0 && pageNumber <= totalPages;
};

export const generateStaticParams = async () =>
  Object.entries(tagPageMap).flatMap(([slug, totalPages]) =>
    Array.from({ length: totalPages }, (_, i) => {
      const pageNumber = i + 1;
      return { tagSlug: [slug, String(pageNumber)] };
    }),
  );

export const generateMetadata = async ({
  params,
}: { params: Promise<{ tagSlug?: string[] }> }) => {
  const { tagSlug } = await params;

  const tag = flatTags.find((tag) => tag.slug === tagSlug?.[0]);

  if (!tag) {
    return;
  }

  const currentPage = tagSlug?.[1] ? Number(tagSlug[1]) : 1;

  if (Number.isNaN(currentPage) || !isValidPage(tag.slug, currentPage)) {
    return;
  }

  const url = `/posts/tags/${tag.slug}/${currentPage}`;

  return {
    title: tag.title,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
    },
  } satisfies Metadata;
};

const Page = async ({
  params,
}: { params: Promise<{ tagSlug?: string[] }> }) => {
  const { tagSlug } = await params;

  const tag = flatTags.find((tag) => tag.slug === tagSlug?.[0]);

  if (!tag) {
    notFound();
  }

  const currentPage = tagSlug?.[1] ? Number(tagSlug[1]) : 1;

  if (Number.isNaN(currentPage) || !isValidPage(tag.slug, currentPage)) {
    notFound();
  }

  const allTagPosts = getPublicPosts().filter(({ tags }) =>
    tags?.includes(tag.title as (typeof tags)[number]),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentPosts = allTagPosts.slice(startIndex, endIndex);

  const parentCategory = extractCategoryByTagTitle(tag.title) ?? "Blog";

  return (
    <>
      <JsonLd
        tagTitle={tag.title}
        tagSlug={tag.slug}
        currentPage={currentPage}
      />
      <header>
        <h1 className="font-sans font-medium">
          {parentCategory} / {tag.title}
        </h1>
        {/*<CategoryNav className="mt-6" />*/}
      </header>
      <div className="mt-6">
        <ArticleList posts={currentPosts} />
      </div>
      <Pagination
        className="mt-12"
        path={`/posts/tags/${tag.slug}`}
        totalPages={tagPageMap[tag.slug] as number}
        currentPage={currentPage}
      />
    </>
  );
};

export default Page;
