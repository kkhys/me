import crypto from 'crypto';
import bs58 from 'bs58';

import type { AllTagsTitle, Base, Category, CategoryTitle, FashionTags, LifeTags, Tag, TechTags } from './constants';
import { allTags, categories, fashionTags, lifeTags, techTags } from './constants';

/**
 * A custom error class representing a not found error.
 *
 * @extends Error
 * @class
 */
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Generates a unique slug based on the given data.
 *
 * @param data - The data used to generate the slug.
 * @returns The generated slug.
 */
export const generateSlug = (data: crypto.BinaryLike) => {
  const hashAlgorithm = 'sha512';
  const encoding = 'hex' satisfies crypto.BinaryToTextEncoding;
  const slugLength = 9;

  const hashValue = crypto.createHash(hashAlgorithm).update(data).digest(encoding);
  const hashArray = new Uint8Array(hashValue.length);

  for (let i = 0; i < hashValue.length; i++) {
    hashArray[i] = hashValue.charCodeAt(i);
  }

  return bs58.encode(hashArray).slice(0, slugLength);
};

/**
 * Extracts the 'title' property from the given object.
 *
 * @template T - The type of object containing the 'title' property.
 * @param item - The object from which to extract the 'title'.
 * @return The value of the 'title' property.
 */
export const extractTitle = <T extends Pick<Base, 'title'>>(item: T) => item.title;

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
