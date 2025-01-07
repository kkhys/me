import { writeFileSync } from "node:fs";
import { type Post, allPosts } from "contentlayer/generated";

type PostEmoji = Pick<Post, "title" | "emoji" | "slug">;

type NavItem = {
  title: string;
  href: string;
  emoji: string;
  category: string;
  tags?: string[];
};

type SearchItem = {
  title: string;
  items: NavItem[];
};

type postMetadata = Pick<
  Post,
  "title" | "slug" | "emoji" | "category" | "tags" | "status"
>;

const FILE_PATHS = {
  POST_EMOJIS: "src/share/post-emojis.ts",
  SEARCH_ITEMS: "src/share/search-items.ts",
  POST_METADATA: "src/share/post-metadata.ts",
};

const getPublishedPosts = () =>
  allPosts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

const writeToFile = (filePath: string, variableName: string, data: unknown) => {
  const timestamp = new Date().toISOString();
  const content = `// This file was automatically generated on ${timestamp}.\n// Please do not remove or edit this file.\n\nexport const ${variableName} = ${JSON.stringify(data, null, 2)};`;
  writeFileSync(filePath, content);
};

const generatePostEmojis = async (posts: typeof allPosts) => {
  const postEmojis = posts.map(({ title, slug, emoji }) => ({
    title,
    slug,
    emoji,
  })) satisfies PostEmoji[];
  writeToFile(FILE_PATHS.POST_EMOJIS, "postEmojis", postEmojis);
};

const generateSearchItems = async (posts: typeof allPosts) => {
  const searchItems = [
    {
      title: "Posts",
      items: posts.map(({ title, slug, emoji, category, tags }) => ({
        title,
        href: `/posts/${slug}`,
        emoji,
        category,
        tags,
      })),
    },
  ] satisfies SearchItem[];
  writeToFile(FILE_PATHS.SEARCH_ITEMS, "searchItems", searchItems);
};

const generatePostMetadata = async (posts: typeof allPosts) => {
  const postMetadata = posts.map(
    ({ title, slug, emoji, category, tags, status }) => ({
      title,
      slug,
      emoji,
      category,
      tags,
      status,
    }),
  ) satisfies postMetadata[];
  writeToFile(FILE_PATHS.POST_METADATA, "postMetadata", postMetadata);
};

const main = async () => {
  const posts = getPublishedPosts();
  await Promise.all([
    generatePostEmojis(posts),
    generateSearchItems(posts),
    generatePostMetadata(posts),
  ]);
};

main().catch((error) => console.error(error));
