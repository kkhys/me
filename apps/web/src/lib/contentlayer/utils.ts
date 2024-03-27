import crypto from 'crypto';
import { bech32m } from 'bech32';
import { remark } from 'remark';
import strip from 'strip-markdown';

import type { AllTagsTitle, Category, CategoryTitle, FashionTags, LifeTags, Tag, TechTags } from './constants';
/**
 * esbuild does not support module path aliases, so relative paths are used
 *
 * @see: https://github.com/evanw/esbuild/issues/394
 * @see: https://github.com/contentlayerdev/contentlayer/issues/238
 */
import { NotFoundError } from '../../exceptions';
import { allTags, categories, extractTitle, fashionTags, lifeTags, techTags } from './constants';

/**
 * Generates a unique slug based on the given data.
 *
 * @param data - The data used to generate the slug.
 * @returns The generated slug.
 */
export const generateSlug = (data: crypto.BinaryLike) => {
  const hashAlgorithm = 'sha512';
  const encoding = 'hex';
  const slugLength = 7;
  const prefix = 'p';

  const hashValue = crypto.createHash(hashAlgorithm).update(data).digest(encoding);
  const buffer = Buffer.from(hashValue, encoding);
  const words = bech32m.toWords(buffer);

  return bech32m.encode(prefix, words, 1024).slice(0, slugLength);
};

/**
 * Generates an excerpt from a given raw string.
 *
 * @param raw - The raw string to generate the excerpt from.
 * @returns The generated excerpt.
 */
export const createExcerpt = async (raw: string) => {
  const maxWords = 120;
  const stripped = (await remark().use(strip).process(raw)).toString();
  const urlWithLineBreakRegex = /^(?:\r\n|\n)(https?:\/\/\S+)(?:\r\n|\n)/gm;
  const whitespaceRegex = /\s+/g;
  const excerpt = stripped
    .trim()
    .replaceAll(urlWithLineBreakRegex, '')
    .replaceAll(whitespaceRegex, '')
    .slice(0, maxWords);
  return stripped.length > maxWords ? excerpt + '...' : excerpt;
};

/**
 * Retrieves the category object based on the given title.
 *
 * @param title - The title of the category.
 * @throws {NotFoundError} If the category is not found.
 * @returns The category object with the matching title.
 */
const getCategoryFromTitle = (title: CategoryTitle) => {
  const category = categories.find((category) => category.title === title);
  if (!category) throw new NotFoundError(`Category not found: ${title}`);
  if (!category?.slug) throw new NotFoundError(`Slug not found: ${title}`);
  if (!category?.emoji) throw new NotFoundError(`Emoji not found: ${title}`);
  return category;
};

/**
 * Retrieves a tag object based on its title.
 *
 * @param title - The title of the tag to retrieve.
 * @returns The tag object associated with the given title.
 * @throws {NotFoundError} If the tag with the given title is not found, or if the slug or emoji is missing.
 */
const getTagFromTitle = (title: AllTagsTitle) => {
  const tag = allTags.find((tag) => tag.title === title);

  if (!tag) throw new NotFoundError(`Tag not found: ${title}`);
  if (!tag?.slug) throw new NotFoundError(`Slug not found: ${title}`);
  if (!tag?.emoji) throw new NotFoundError(`Emoji not found: ${title}`);

  return tag;
};

/**
 * Checks if a specific tag exists in a given target tag array.
 *
 * @param targetTag - The target tag array to search in.
 * @param tagTitle - The title of the tag to check existence for.
 * @throws {NotFoundError} if the tag is not found in the target tag array.
 * @returns True if the tag exists, otherwise false.
 */
const isExistTag = <T extends TechTags | LifeTags | FashionTags>(targetTag: T, tagTitle: AllTagsTitle) => {
  if (!targetTag.map(extractTitle).includes(tagTitle)) throw new NotFoundError(`Tag not found: ${tagTitle}`);

  return true;
};

/**
 * Generates a category object based on the given title.
 *
 * @param title - The title of the category.
 * @returns The generated category object.
 */
export const generateCategoryObject = (title: CategoryTitle) => {
  const { slug, emoji } = getCategoryFromTitle(title);

  return {
    title,
    slug,
    emoji,
  } satisfies Category;
};

/**
 * Generates a tag object based on the provided tag title and category.
 *
 * @param tagTitle - The title of the tag.
 * @param category - The category of the tag.
 * @returns The generated tag object.
 */
export const generateTagObject = (tagTitle: AllTagsTitle, category: CategoryTitle) => {
  switch (category) {
    case 'Tech':
      isExistTag(techTags, tagTitle);
      break;
    case 'Life':
      isExistTag(lifeTags, tagTitle);
      break;
    case 'Fashion':
      isExistTag(fashionTags, tagTitle);
      break;
  }

  const { slug, emoji } = getTagFromTitle(tagTitle);

  return {
    title: tagTitle,
    slug,
    emoji,
  } satisfies Tag;
};
