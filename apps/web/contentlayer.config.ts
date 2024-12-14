import * as crypto from "node:crypto";
import { bech32m } from "bech32";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { format, parseISO } from "date-fns";
import rehypeMermaid from "rehype-mermaid";
import rehypeSlug from "rehype-slug"; // don't change this line
import rehypeUnwrapImages from "rehype-unwrap-images";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import strip from "strip-markdown";
import {
  allTagTitles,
  categories,
  categoryTitles,
  siteConfig,
  tags,
} from "#/config";
import type { AllTagsTitle, Category, CategoryTitle, Tag } from "#/config";
import {
  YouTubeEmbedHandler,
  linkCardHandler,
  rehypeMermaidOptions,
  remarkLinkCard,
  remarkNextImage,
  remarkYouTubeEmbed,
} from "./src/lib/mdx";
import { generateEmojiSvg } from "./src/utils/emoji";

type ExtendedRemarkRehypeOptions = RemarkRehypeOptions & {
  handlers: {
    "link-card": typeof linkCardHandler;
    "youtube-embed": typeof YouTubeEmbedHandler;
  };
};

const Legal = defineDocumentType(() => ({
  name: "Legal",
  filePathPattern: "legal/**/*.md",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    slug: {
      type: "string",
      required: true,
    },
    publishedAt: {
      type: "date",
      required: true,
    },
    updatedAt: {
      type: "date",
    },
  },
}));

const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/index.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    emoji: {
      type: "string",
      required: true,
    },
    category: {
      type: "enum",
      options: categoryTitles,
      required: true,
    },
    tags: {
      type: "list",
      of: { type: "enum", options: allTagTitles },
    },
    status: {
      type: "enum",
      options: ["draft", "published"],
      required: true,
    },
    publishedAt: {
      type: "date",
      required: true,
    },
    updatedAt: {
      type: "date",
    },
  },
  computedFields: {
    excerpt: {
      type: "string",
      resolve: async ({ body: { raw } }) => await createExcerpt(raw),
    },
    url: {
      type: "string",
      resolve: ({ _id }) => `${siteConfig.url}/posts/${generateSlug(_id)}`,
    },
    editUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github}/edit/main/${sourceFilePath}`,
    },
    sourceUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github}/blob/main/${sourceFilePath}?plain=1`,
    },
    revisionHistoryUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github}/commits/main/${sourceFilePath}`,
    },
    publishedAtFormattedUs: {
      type: "string",
      resolve: ({ publishedAt }) =>
        format(parseISO(publishedAt), "LLLL d, yyyy"),
    },
    publishedAtFormattedIso: {
      type: "string",
      resolve: ({ publishedAt }) => format(parseISO(publishedAt), "yyyy/MM/dd"),
    },
    updatedAtFormattedUs: {
      type: "string",
      resolve: ({ updatedAt }) =>
        updatedAt ? format(parseISO(updatedAt), "LLLL d, yyyy") : undefined,
    },
    updatedAtFormattedIso: {
      type: "string",
      resolve: ({ updatedAt }) =>
        updatedAt ? format(parseISO(updatedAt), "yyyy/MM/dd") : undefined,
    },
    slug: {
      type: "string",
      resolve: ({ _id }) => generateSlug(_id),
    },
    categoryObject: {
      type: "json",
      resolve: ({ category }) => generateCategoryObject(category),
    },
    tagObjectList: {
      type: "list",
      resolve: ({ tags, category }) => {
        if (!tags) {
          return undefined;
        }
        return Array.from(tags).map((tag) => generateTagObject(tag, category));
      },
    },
    emojiSvg: {
      type: "string",
      resolve: async ({ emoji }) => await generateEmojiSvg({ emoji }),
    },
  },
}));

const createExcerpt = async (raw: string) => {
  const maxWords = 160;
  const stripped = (await remark().use(strip).process(raw)).toString();
  const urlWithLineBreakRegex = /^(?:\r\n|\n)(https?:\/\/\S+)(?:\r\n|\n)/gm;
  const whitespaceRegex = /\s+/g;
  const excerpt = stripped
    .trim()
    .replaceAll(urlWithLineBreakRegex, "")
    .replaceAll(whitespaceRegex, "")
    .slice(0, maxWords);
  return stripped.length > maxWords ? `${excerpt}...` : excerpt;
};

const generateSlug = (data: crypto.BinaryLike) => {
  const hashAlgorithm = "sha512";
  const encoding = "hex";
  const slugLength = 7;
  const prefix = "p";

  const hashValue = crypto
    .createHash(hashAlgorithm)
    .update(data)
    .digest(encoding);
  const buffer = Buffer.from(hashValue, encoding);
  const words = bech32m.toWords(buffer);

  return bech32m.encode(prefix, words, 1024).slice(0, slugLength);
};

const generateCategoryObject = (title: CategoryTitle) => {
  const category = categories.find((category) => category.title === title);

  if (!category) {
    throw new NotFoundError(`Category not found: ${title}`);
  }

  const { slug, emoji } = category;

  return {
    title,
    slug,
    emoji,
  } satisfies Category;
};

const generateTagObject = (
  tagTitle: AllTagsTitle,
  category: CategoryTitle,
): Tag => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const categoryTagMap = Object.fromEntries(
    (Object.keys(tags) as Array<keyof typeof tags>).map((key) => [
      capitalize(key),
      tags[key],
    ]),
  ) as Record<CategoryTitle, Tag[]>;

  const targetTags = categoryTagMap[category];

  if (!targetTags) {
    throw new NotFoundError(`Category not found: ${category}`);
  }

  if (!targetTags.map((tag) => tag.title).includes(tagTitle)) {
    throw new NotFoundError(`Tag not found: ${tagTitle}`);
  }

  const { slug, emoji } = Object.values(tags)
    .flat()
    .find((tag) => tag.title === tagTitle) as Tag;

  return {
    title: tagTitle,
    slug,
    emoji,
  };
};

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Legal],
  contentDirExclude: ["license.md", "readme.md"],
  mdx: {
    remarkPlugins: [
      [remarkGfm],
      [remarkYouTubeEmbed],
      [remarkLinkCard],
      [remarkNextImage],
    ],
    rehypePlugins: [
      [rehypeSlug],
      [rehypeMermaid, rehypeMermaidOptions],
      [rehypeUnwrapImages],
    ],
    mdxOptions: (options) => {
      options.remarkRehypeOptions = {
        handlers: {
          "link-card": linkCardHandler,
          "youtube-embed": YouTubeEmbedHandler,
        },
      } as ExtendedRemarkRehypeOptions;
      return options;
    },
  },
});
