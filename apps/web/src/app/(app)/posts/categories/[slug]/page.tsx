import { notFound } from "next/navigation";
import { categories } from "#/config";
import { ArticleList, CategoryNav } from "#/ui/post";
import { getPublicPosts } from "#/utils/post";

export const generateStaticParams = async () =>
  categories.map(({ slug }) => ({ slug }));

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const category = categories.find((category) => category.slug === slug);

  if (!category) {
    notFound();
  }

  const posts = getPublicPosts().filter(
    (post) => post.category === category.title,
  );

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
