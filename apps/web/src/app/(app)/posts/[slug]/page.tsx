import { Prose } from "@kkhys/ui";
import { notFound } from "next/navigation";
import { ArticleList, EyeCatch, Mdx, Time } from "#/ui/post";
import { getPostBySlug, getPublicPosts, getRelatedPosts } from "#/utils/post";

import "#/styles/code-block.css";

export const generateStaticParams = async () =>
  getPublicPosts().map(({ slug }) => ({ slug }));

const Page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const {
    title,
    category,
    publishedAt,
    publishedAtFormattedUs,
    status,
    _id,
    body: { code },
    emojiSvg,
  } = post;

  const relatedPosts = getRelatedPosts({ _id, category });

  return (
    <>
      <header>
        <EyeCatch emoji={emojiSvg} />
        {status === "draft" && (
          <span className="font-sans text-xs text-red-400">Draft</span>
        )}
        <h1 className="palt mt-4 font-medium">{title}</h1>
        <div className="mt-2 flex items-center justify-between">
          <Time
            publishedAt={publishedAt}
            publishedAtFormattedUs={publishedAtFormattedUs}
          />
          {/*{env.NODE_ENV !== 'development' ? (*/}
          {/*    <Suspense fallback={<ViewCounterSkeleton/>}>*/}
          {/*      <ViewCounter slug={slug}/>*/}
          {/*    </Suspense>*/}
          {/*) : (*/}
          <p className="font-sans text-sm text-muted-foreground">xxx views</p>
          {/*)}*/}
        </div>
      </header>
      <Prose>
        <Mdx code={code} />
      </Prose>
      {relatedPosts.length !== 0 && (
        <div className="mt-8">
          <hr className="mt-12" />
          <span className="mt-12 block font-sans font-medium">
            Related Posts
          </span>
          <ArticleList className="mt-6" posts={relatedPosts} showDate={false} />
        </div>
      )}
    </>
  );
};

export default Page;
