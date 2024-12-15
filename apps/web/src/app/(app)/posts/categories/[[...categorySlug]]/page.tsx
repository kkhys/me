import { notFound } from "next/navigation";
import { categories } from "#/config";
import { ArticleList, CategoryNav, Pagination } from "#/ui/post";
import { getPublicPosts } from "#/utils/post";

const itemsPerPage = 10;

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
