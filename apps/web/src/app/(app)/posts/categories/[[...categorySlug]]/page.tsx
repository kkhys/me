import { notFound } from "next/navigation";
import type { BreadcrumbList, WithContext } from "schema-dts";
import { categories, itemsPerPage, siteConfig } from "#/config";
import { ArticleList, CategoryNav, Pagination } from "#/ui/post";
import { getPublicPosts } from "#/utils/post";

const JsonLd = ({
  categoryTitle,
  categorySlug,
  currentPage,
}: {
  categoryTitle: string;
  categorySlug: string;
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
        name: `Blog ${categoryTitle} Page ${currentPage}`,
        item: `${siteConfig.url}/posts/categories/${categorySlug}/${currentPage}`,
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

const categoryPageMap = categories.reduce(
  (map, { slug, title }) => {
    const allPosts = getPublicPosts();
    const categoryPosts = allPosts.filter((post) => post.category === title);
    map[slug] = Math.ceil(categoryPosts.length / itemsPerPage);
    return map;
  },
  {} as Record<string, number>,
);

const isValidPage = (categorySlug: string, pageNumber: number): boolean => {
  const totalPages = categoryPageMap[categorySlug];

  if (!totalPages) {
    return false;
  }

  return pageNumber > 0 && pageNumber <= totalPages;
};

export const generateStaticParams = async () => {
  return Object.entries(categoryPageMap).flatMap(([slug, totalPages]) =>
    Array.from({ length: totalPages }, (_, i) => {
      const pageNumber = i + 1; // ページ番号を 1 から開始
      return { categorySlug: [slug, String(pageNumber)] };
    }),
  );
};

const Page = async ({
  params,
}: { params: Promise<{ categorySlug?: string[] }> }) => {
  const { categorySlug } = await params;

  const category = categories.find(
    (category) => category.slug === categorySlug?.[0],
  );

  if (!category) {
    notFound();
  }

  const currentPage = categorySlug?.[1] ? Number(categorySlug[1]) : 1;

  if (Number.isNaN(currentPage) || !isValidPage(category.slug, currentPage)) {
    notFound();
  }

  const allCategoryPosts = getPublicPosts().filter(
    (post) => post.category === category.title,
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentPosts = allCategoryPosts.slice(startIndex, endIndex);

  return (
    <>
      <JsonLd
        categoryTitle={category.title}
        categorySlug={category.slug}
        currentPage={currentPage}
      />
      <header>
        <h1 className="font-sans font-medium">Blog</h1>
        <CategoryNav className="mt-6" />
      </header>
      <div className="mt-6">
        <ArticleList posts={currentPosts} />
      </div>
      <Pagination
        className="mt-12"
        path={`/posts/categories/${category.slug}`}
        totalPages={categoryPageMap[category.slug] as number}
        currentPage={currentPage}
      />
    </>
  );
};

export default Page;
