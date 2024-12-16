import { notFound } from "next/navigation";
import { itemsPerPage } from "#/config";
import { ArticleList, CategoryNav, Pagination } from "#/ui/post";
import { getPublicPosts } from "#/utils/post";

const allPosts = getPublicPosts();
const totalPages = Math.ceil(allPosts.length / itemsPerPage);

const isValidPage = (pageNumber: number): boolean => {
  return pageNumber > 0 && pageNumber <= totalPages;
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
