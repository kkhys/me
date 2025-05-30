import { Prose } from "@kkhys/ui/prose";
import { notFound } from "next/navigation";
import { ArticleList } from "#/app/posts/_ui/article-list";
import { EyeCatch } from "#/app/posts/_ui/eye-catch";
import { Mdx } from "#/app/posts/_ui/mdx-components";
import { PrevAndNextPager } from "#/app/posts/_ui/prev-and-next-pager";
import { TagCloud } from "#/app/posts/_ui/tag-cloud";
import { ViewCounter, ViewCounterSkeleton } from "#/app/posts/_ui/view-counter";

import {
  getPostBySlug,
  getPostMetadataBySlug,
  getPublicPosts,
  getRelatedPosts,
} from "#/utils/post";

import "#/styles/code-block.css";
import "#/styles/react-medium-image-zoom.css";
import { FadeIn, FadeInStagger } from "@kkhys/ui/fade-in";
import type { Post } from "contentlayer/generated";
import type { Metadata } from "next";
import { Suspense } from "react";
import React from "react";
import type { BlogPosting, BreadcrumbList, WithContext } from "schema-dts";
import { me, siteConfig } from "#/config/site";
import { tagCloudItems } from "#/share/tag-cloud-items";
import { ActionController } from "#/ui/action-controller";

const JsonLd = ({
  post: { title, slug, publishedAt, updatedAt },
}: { post: Post }) => {
  const jsonLdBlogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: [
      {
        "@type": "Person",
        name: me.name,
        url: siteConfig.url,
      },
    ],
    dateModified: updatedAt ?? undefined,
    datePublished: publishedAt,
    headline: title,
    image: `${siteConfig.url}/posts/${slug}/opengraph-image/default`,
  } satisfies WithContext<BlogPosting>;

  const jsonLdBreadcrumbList = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteConfig.url}/posts/${slug}`,
      },
    ],
  } satisfies WithContext<BreadcrumbList>;

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([jsonLdBlogPosting, jsonLdBreadcrumbList]),
      }}
    />
  );
};

export const generateStaticParams = async () =>
  getPublicPosts().map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = getPostMetadataBySlug(slug);

  if (!post) {
    return;
  }

  const { title, excerpt, publishedAt, updatedAt } = post;
  const url = `/posts/${slug}`;

  return {
    title,
    description: excerpt,
    alternates: {
      canonical: `/posts/${slug}`,
    },
    openGraph: {
      type: "article",
      url,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? undefined,
    },
  } satisfies Metadata;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
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
    tags,
  } = post;

  const relatedPosts = getRelatedPosts({ _id, category });

  const postTags = tagCloudItems.filter(({ title }) =>
    tags?.includes(title as (typeof tags)[number]),
  );

  return (
    <FadeInStagger faster>
      <JsonLd post={post} />
      <article>
        <header>
          <FadeIn>
            {status === "draft" ? (
              <div className="flex justify-between items-center">
                <EyeCatch emoji={emojiSvg} />
                <span className="font-sans text-xs text-red-400">Draft</span>
              </div>
            ) : (
              <EyeCatch emoji={emojiSvg} />
            )}
          </FadeIn>
          <FadeIn>
            <h1 className="palt mt-4 font-medium">{title}</h1>
          </FadeIn>
          <FadeIn>
            <div className="mt-2 flex items-center justify-between">
              <time
                dateTime={publishedAt}
                className="font-sans text-sm text-muted-foreground"
              >
                {publishedAtFormattedUs}
              </time>
              <Suspense fallback={<ViewCounterSkeleton />}>
                <ViewCounter slug={slug} />
              </Suspense>
            </div>
          </FadeIn>
        </header>
        <FadeIn>
          <Prose>
            <Mdx code={code} />
          </Prose>
        </FadeIn>
        <FadeIn>
          <TagCloud tags={postTags} className="mt-12" />
        </FadeIn>
        <FadeIn>
          <ActionController data={post} title={title} className="mt-8" />
        </FadeIn>
        <FadeIn>
          <PrevAndNextPager id={_id} className="mt-8" />
        </FadeIn>
        {relatedPosts.length !== 0 && (
          <div className="mt-8">
            <FadeIn>
              <hr className="mt-12" />
            </FadeIn>
            <FadeIn>
              <span className="mt-12 block font-sans font-medium">
                Related Posts
              </span>
            </FadeIn>
            <FadeIn>
              <ArticleList
                className="mt-6"
                posts={relatedPosts}
                showDate={false}
              />
            </FadeIn>
          </div>
        )}
      </article>
    </FadeInStagger>
  );
};

export default Page;
