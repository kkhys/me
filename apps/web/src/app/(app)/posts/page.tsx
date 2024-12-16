import { itemsPerPage } from "#/config";
import { ArticleList, CategoryNav, Pagination } from "#/ui/post";
import { getPublicPosts } from "#/utils/post";

const Page = () => {
  const allPosts = getPublicPosts();
  const totalPages = Math.ceil(allPosts.length / itemsPerPage);
  const currentPosts = allPosts.slice(0, itemsPerPage);

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
        currentPage={1}
      />
    </>
  );
};

export default Page;
