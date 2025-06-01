import { type BinaryLike, createHash } from "node:crypto";
import { bech32m } from "bech32";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { format, parseISO } from "date-fns";
import rehypeMermaid from "rehype-mermaid";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import strip from "strip-markdown";
import {
  type CategoryTitle,
  categories,
  categoryTitles,
} from "#/config/category";
import { type CameraName, cameraNames, cameras } from "#/config/photo/camera";
import { lensNames, lenses } from "#/config/photo/lens";
import { siteConfig } from "#/config/site";
import { type AllTagsTitle, type Tag, allTagTitles, tags } from "#/config/tag";
import { getImage } from "#/utils/image";
import { rehypeMermaidOptions } from "./src/lib/mdx/rehype-mermaid";
import {
  afterRehypePrettyCode,
  beforeRehypePrettyCode,
  rehypePrettyCodeOptions,
} from "./src/lib/mdx/rehype-pretty-code";
import {
  linkCardHandler,
  remarkLinkCard,
} from "./src/lib/mdx/remark-link-card";
import { remarkNextImage } from "./src/lib/mdx/remark-next-image";
import {
  TweetEmbedHandler,
  remarkTweetEmbed,
} from "./src/lib/mdx/remark-tweet-embed";
import {
  YouTubeEmbedHandler,
  remarkYouTubeEmbed,
} from "./src/lib/mdx/remark-youtube-embed";
import { generateEmojiSvg } from "./src/utils/emoji";

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
        `${siteConfig.github.content}/edit/main/apps/web/content/${sourceFilePath}`,
    },
    sourceUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github.content}/blob/main/apps/web/content/${sourceFilePath}?plain=1`,
    },
    revisionHistoryUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github.content}/commits/main/apps/web/content/${sourceFilePath}`,
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

const Photo = defineDocumentType(() => ({
  name: "Photo",
  filePathPattern: "photos/**/*.md",
  fields: {
    path: {
      type: "string",
      required: true,
    },
    camera: {
      type: "enum",
      options: cameraNames,
      required: true,
    },
    lens: {
      type: "enum",
      options: lensNames,
      required: true,
    },
    fNumber: {
      type: "number",
      required: true,
    },
    focalLength: {
      type: "number",
      required: true,
    },
    shutterSpeed: {
      type: "string",
      required: true,
    },
    iso: {
      type: "number",
      required: true,
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
    imageObject: {
      type: "json",
      resolve: async ({ path }) => {
        const {
          img: { width, height },
          base64,
        } = await getImage(path);
        return {
          width,
          height,
          blurDataURL: base64,
        };
      },
    },
    url: {
      type: "string",
      resolve: ({ _id }) => `${siteConfig.url}/photos/${generateSlug(_id)}`,
    },
    editUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github.content}/edit/main/${sourceFilePath}`,
    },
    sourceUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github.content}/blob/main/${sourceFilePath}?plain=1`,
    },
    revisionHistoryUrl: {
      type: "string",
      resolve: ({ _raw: { sourceFilePath } }) =>
        `${siteConfig.github.content}/commits/main/${sourceFilePath}`,
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
    cameraData: {
      type: "json",
      resolve: ({ camera }) => generateCameraObject(camera),
    },
    lensData: {
      type: "json",
      resolve: ({ lens }) => generateLensObject(lens),
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

const generateSlug = (data: BinaryLike) => {
  const hashAlgorithm = "sha512";
  const encoding = "hex";
  const slugLength = 7;
  const prefix = "p";

  const hashValue = createHash(hashAlgorithm).update(data).digest(encoding);
  const buffer = Buffer.from(hashValue, encoding);
  const words = bech32m.toWords(buffer);

  return bech32m.encode(prefix, words, 1024).slice(0, slugLength);
};

const generateCategoryObject = (title: CategoryTitle) => {
  const category = categories.find((category) => category.title === title);

  if (!category) {
    throw new NotFoundError(`Category not found: ${title}`);
  }

  return category;
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

  return Object.values(tags)
    .flat()
    .find((tag) => tag.title === tagTitle) as Tag;
};

const generateCameraObject = (name: CameraName) => {
  const camera = cameras.find((camera) => camera.name === name);

  if (!camera) {
    throw new NotFoundError(`Camera not found: ${name}`);
  }

  return camera;
};

const generateLensObject = (name: CameraName) => {
  const lens = lenses.find((lens) => lens.name === name);

  if (!lens) {
    throw new NotFoundError(`Lens not found: ${name}`);
  }

  return lens;
};

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Legal, Photo],
  contentDirExclude: ["license.md", "readme.md"],
  mdx: {
    remarkPlugins: [
      [remarkGfm],
      [remarkYouTubeEmbed],
      [remarkTweetEmbed],
      [remarkLinkCard],
      [remarkNextImage],
    ],
    rehypePlugins: [
      [rehypeSlug],
      [rehypeMermaid, rehypeMermaidOptions],
      [rehypeUnwrapImages],
      [beforeRehypePrettyCode],
      [rehypePrettyCode, rehypePrettyCodeOptions],
      [afterRehypePrettyCode],
    ],
    mdxOptions: (options) => {
      options.remarkRehypeOptions = {
        handlers: {
          "link-card": linkCardHandler,
          "youtube-embed": YouTubeEmbedHandler,
          "tweet-embed": TweetEmbedHandler,
        },
      } as RemarkRehypeOptions;
      return options;
    },
  },
});
