import { Prose } from "@kkhys/ui";
import { notFound } from "next/navigation";
import {
  ActionController,
  ArticleList,
  EyeCatch,
  Mdx,
  PrevAndNextPager,
  TagCloud,
  ViewCounter,
  ViewCounterSkeleton,
} from "#/app/posts/_ui";
import {
  getPostBySlug,
  getPostMetadataBySlug,
  getPublicPosts,
  getRelatedPosts,
} from "#/utils/post";

import "#/styles/code-block.css";
import "#/styles/react-medium-image-zoom.css";
import type { Post } from "contentlayer/generated";
import type { Metadata } from "next";
import { Suspense } from "react";
import * as React from "react";
import type { BlogPosting, BreadcrumbList, WithContext } from "schema-dts";
import { me, siteConfig } from "#/config";
import { tagCloudItems } from "#/share/tag-cloud-items";

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
    <>
      <JsonLd post={post} />
      <article>
        <header>
          {status === "draft" ? (
            <div className="flex justify-between items-center">
              <EyeCatch emoji={emojiSvg} />
              <span className="font-sans text-xs text-red-400">Draft</span>
            </div>
          ) : (
            <EyeCatch emoji={emojiSvg} />
          )}
          <h1 className="palt mt-4 font-medium">{title}</h1>
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
        </header>
        <Prose>
          <Mdx code={code} />
        </Prose>
        <TagCloud tags={postTags} className="mt-12" />
        <ActionController post={post} className="mt-8" />
        <PrevAndNextPager id={_id} className="mt-8" />
        {relatedPosts.length !== 0 && (
          <div className="mt-8">
            <hr className="mt-12" />
            <span className="mt-12 block font-sans font-medium">
              Related Posts
            </span>
            <ArticleList
              className="mt-6"
              posts={relatedPosts}
              showDate={false}
            />
          </div>
        )}
      </article>
    </>
  );
};

export default Page;
