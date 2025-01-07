import { writeFileSync } from "node:fs";
import { allPosts } from "contentlayer/generated";

type PostEmoji = {
  title: string;
  slug: string;
  emoji: string;
};

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

const FILE_PATHS = {
  POST_EMOJIS: "src/share/post-emojis.ts",
  SEARCH_ITEMS: "src/share/search-items.ts",
};

const getPublishedPosts = () =>
  allPosts.filter((post) => post.status === "published");

const writeToFile = (filePath: string, variableName: string, data: unknown) => {
  const content = `export const ${variableName} = ${JSON.stringify(data, null, 2)};`;
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

const main = async () => {
  const posts = getPublishedPosts();
  await Promise.all([generatePostEmojis(posts), generateSearchItems(posts)]);
};

main().catch((error) => console.error(error));
