import { ArticleList, CategoryNav } from "#/ui/post";
import { getPublicPosts } from "#/utils/post";

const Page = () => {
  const posts = getPublicPosts();

  return (
    <>
      <header>
        <h1 className="font-sans font-medium">Blog</h1>
        <CategoryNav className="mt-6" />
      </header>
      <div className="mt-6">
        <ArticleList posts={posts} />
      </div>
    </>
  );
};

export default Page;
