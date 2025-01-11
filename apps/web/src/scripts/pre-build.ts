import { writeFileSync } from "node:fs";
import {
  type Legal,
  type Post,
  allLegals,
  allPosts,
} from "contentlayer/generated";
import type {
  LegalMetadata,
  PostMetadata,
  PostMetadataForEdge,
  SearchItem,
} from "#/app/posts/_types";

const FILE_PATHS = {
  POST_METADATA_FOR_EDGE: "src/share/post-metadata-for-edge.ts",
  SEARCH_ITEMS: "src/share/search-items.ts",
  POST_METADATA: "src/share/post-metadata.ts",
  LEGAL_METADATA: "src/share/legal-metadata.ts",
};

const getSortedItems = <T extends { publishedAt: string }>(items: T[]): T[] =>
  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

const writeToFile = <T>(
  filePath: string,
  variableName: string,
  data: T,
  typeDefinition: string,
) => {
  const content = `
// This file was automatically generated.
// Please do not remove or edit this file.
import type { ${typeDefinition}} from "#/app/posts/_types";

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
  );
};

const main = async () => {
  const posts = getSortedItems(allPosts);
  const legals = getSortedItems(allLegals);
  await Promise.all([
    generatePostMetadataForEdge(posts),
    generateSearchItems(posts),
    generatePostMetadata(posts),
    generateLegalMetadata(legals),
  ]);
};

main().catch((error) => console.error(error));
