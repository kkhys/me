import { writeFileSync } from "node:fs";
import {
  type Legal,
  type Photo,
  type Post,
  allLegals,
  allPhotos,
  allPosts,
} from "contentlayer/generated";
import { compareAsc, compareDesc, format, parseISO } from "date-fns";
import type { MetadataRoute } from "next";
import type { PhotoMetadata } from "#/app/photos/_types";
import type {
  LegalMetadata,
  PostMetadata,
  PostMetadataForEdge,
  SearchItem,
  TagCloudItem,
} from "#/app/posts/_types";
import { categories, flatTags, itemsPerPage, siteConfig } from "#/config";
import { formatPublishedDate } from "#/utils/date";
import { generateEmojiSvg } from "#/utils/emoji";

const FILE_PATHS = {
  POST_METADATA_FOR_EDGE: "src/share/post-metadata-for-edge.ts",
  SEARCH_ITEMS: "src/share/search-items.ts",
  POST_METADATA: "src/share/post-metadata.ts",
  LEGAL_METADATA: "src/share/legal-metadata.ts",
  STATIC_SITEMAP: "src/share/static-sitemap.ts",
  TAG_COULD_ITEMS: "src/share/tag-cloud-items.ts",
  PHOTO_METADATA: "src/share/photo-metadata.ts",
};

const getSortedItems = <T extends { publishedAt: string }>(
  items: T[],
  sort: "asc" | "desc" = "desc",
): T[] =>
  items.sort((a, b) =>
    sort === "asc"
      ? compareAsc(new Date(a.publishedAt), new Date(b.publishedAt))
      : compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
  );

const writeToFile = <T>(
  filePath: string,
  variableName: string,
  data: T,
  typeDefinition: string,
  type: "posts" | "photos",
) => {
  const content = `
// This file was automatically generated.
// Please do not remove or edit this file.

import type { ${typeDefinition}} from "#/app/${type}/_types";

export const ${variableName}: ${typeDefinition}[] = ${JSON.stringify(data, null, 2)};
`;
  writeFileSync(filePath, content);
};

const generatePostMetadataForEdge = async (posts: Post[]) => {
  const postMetadataForEdge = posts.map(({ title, emoji, slug }) => ({
    title,
    emoji,
    slug,
  })) satisfies PostMetadataForEdge[];
  writeToFile(
    FILE_PATHS.POST_METADATA_FOR_EDGE,
    "postMetadataForEdge",
    postMetadataForEdge,
    "PostMetadataForEdge",
    "posts",
  );
};

const generateSearchItems = async (posts: Post[]) => {
  const searchItems = posts.map(
    ({ title, slug, emojiSvg, category, tags, status }) => ({
      title,
      href: `/posts/${slug}`,
      emojiSvg,
      category,
      tags,
      status,
    }),
  ) satisfies SearchItem[];
  writeToFile(
    FILE_PATHS.SEARCH_ITEMS,
    "searchItems",
    searchItems,
    "SearchItem",
    "posts",
  );
};

const generatePostMetadata = async (posts: Post[]) => {
  const postMetadata = posts.map(
    ({
      _id,
      title,
      slug,
      emoji,
      category,
      tags,
      status,
      publishedAt,
      updatedAt,
      excerpt,
      url,
      editUrl,
      sourceUrl,
      revisionHistoryUrl,
    }) => ({
      _id,
      title,
      slug,
      emoji,
      category,
      tags,
      status,
      publishedAt,
      updatedAt,
      excerpt,
      url,
      editUrl,
      sourceUrl,
      revisionHistoryUrl,
    }),
  ) satisfies PostMetadata[];
  writeToFile(
    FILE_PATHS.POST_METADATA,
    "postMetadata",
    postMetadata,
    "PostMetadata",
    "posts",
  );
};

const generateLegalMetadata = async (legals: Legal[]) => {
  const legalMetadata = legals.map(({ title, slug, publishedAt }) => ({
    title,
    slug,
    publishedAt,
  })) satisfies LegalMetadata[];
  writeToFile(
    FILE_PATHS.LEGAL_METADATA,
    "legalMetadata",
    legalMetadata,
    "LegalMetadata",
    "posts",
  );
};

const generateStaticSitemap = async ({
  posts,
  legals,
}: {
  posts: Post[];
  legals: Legal[];
}) => {
  const routePaths = ["/", "/contact"];
  const publishedPosts = posts.filter(({ status }) => status === "published");

  const routesSitemap = routePaths.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: formatPublishedDate(new Date()),
  })) satisfies MetadataRoute.Sitemap;

  const legalsSitemap = legals.map(({ slug, publishedAt }) => ({
    url: `${siteConfig.url}/${slug}`,
    lastModified: formatPublishedDate(publishedAt),
  })) satisfies MetadataRoute.Sitemap;

  const postsSitemap = publishedPosts.map(({ url, publishedAt }) => ({
    url,
    lastModified: formatPublishedDate(publishedAt),
  })) satisfies MetadataRoute.Sitemap;

  const postTotalPages = Math.ceil(publishedPosts.length / itemsPerPage);
  const pagedPostSitemap = Array.from(
    { length: postTotalPages },
    (_, index) => ({
      url: `${siteConfig.url}/posts/page/${index + 1}`,
      lastModified: formatPublishedDate(new Date()),
    }),
  ) satisfies MetadataRoute.Sitemap;

  const categorySitemaps = categories.map(({ title, slug }) => {
    const postsInCategory = publishedPosts.filter(
      (post) => post.category === title,
    );
    const categoryTotalPages = Math.ceil(postsInCategory.length / itemsPerPage);

    return Array.from({ length: categoryTotalPages }, (_, index) => ({
      url: `${siteConfig.url}/posts/categories/${slug}/${index + 1}`,
      lastModified: formatPublishedDate(new Date()),
    })) satisfies MetadataRoute.Sitemap;
  });

  const tagSitemaps = flatTags.map(({ title, slug }) => {
    const postsInTag = publishedPosts.filter(({ tags }) =>
      tags?.includes(title as (typeof tags)[number]),
    );
    const tagTotalPages = Math.ceil(postsInTag.length / itemsPerPage);

    return Array.from({ length: tagTotalPages }, (_, index) => ({
      url: `${siteConfig.url}/posts/tags/${slug}/${index + 1}`,
      lastModified: formatPublishedDate(new Date()),
    })) satisfies MetadataRoute.Sitemap;
  });

  const staticSiteMap = [
    ...routesSitemap,
    ...legalsSitemap,
    ...postsSitemap,
    ...pagedPostSitemap,
    ...categorySitemaps.flat(),
    ...tagSitemaps.flat(),
  ];

  const content = `
// This file was automatically generated.
// Please do not remove or edit this file.

import type { MetadataRoute } from "next";

export const staticSitemap: MetadataRoute.Sitemap = ${JSON.stringify(staticSiteMap, null, 2)};
`;
  writeFileSync(FILE_PATHS.STATIC_SITEMAP, content);
};

const generateTagCloudItems = async () => {
  const tagCloudItems = (await Promise.all(
    flatTags.map(async ({ title, slug, emoji }) => ({
      title,
      slug,
      emoji,
      emojiSvg: await generateEmojiSvg({ emoji, isColored: true }),
    })),
  )) satisfies TagCloudItem[];
  writeToFile(
    FILE_PATHS.TAG_COULD_ITEMS,
    "tagCloudItems",
    tagCloudItems,
    "TagCloudItem",
    "posts",
  );
};

const generatePhotoMetadata = async (photos: Photo[]) => {
  const getPhotoIndex = (slug: string) =>
    photos
      .sort((a, b) =>
        compareAsc(new Date(a.publishedAt), new Date(b.publishedAt)),
      )
      .findIndex((photo) => photo.slug === slug) + 1 || 0;
  const generateTitle = ({
    publishedAt,
    slug,
  }: Pick<Photo, "publishedAt" | "slug">) =>
    `${format(parseISO(publishedAt), "yyyy-MM-dd")} / ${getPhotoIndex(slug)}`;
  const photoMetadata = photos.map(({ slug, publishedAt }) => ({
    slug,
    title: generateTitle({ publishedAt, slug }),
  })) satisfies PhotoMetadata[];
  writeToFile(
    FILE_PATHS.PHOTO_METADATA,
    "photoMetadata",
    photoMetadata,
    "PhotoMetadata",
    "photos",
  );
};

const main = async () => {
  const posts = getSortedItems(allPosts);
  const legals = getSortedItems(allLegals);
  const photos = getSortedItems(allPhotos, "asc");

  await Promise.all([
    generatePostMetadataForEdge(posts),
    generateSearchItems(posts),
    generatePostMetadata(posts),
    generateLegalMetadata(legals),
    generateStaticSitemap({ posts, legals }),
    generateTagCloudItems(),
    generatePhotoMetadata(photos),
  ]);
};

main().catch((error) => console.error(error));
