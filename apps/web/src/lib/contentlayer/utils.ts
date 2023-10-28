import crypto from 'crypto';
import bs58 from 'bs58';

import type { AllTagsTitle, Base, Category, CategoryTitle, FashionTags, LifeTags, Tag, TechTags } from './constants';
import { allTags, categories, fashionTags, lifeTags, techTags } from './constants';

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

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

export const extractTitle = <T extends Pick<Base, 'title'>>(item: T) => item.title;

const getCategoryFromTitle = (title: CategoryTitle) => {
  const category = categories.find((category) => category.title === title);
  if (!category) throw new NotFoundError(`Category not found: ${title}`);
  if (!category?.slug) throw new NotFoundError(`Slug not found: ${title}`);
  if (!category?.emoji) throw new NotFoundError(`Emoji not found: ${title}`);
  return category;
};

const getTagFromTitle = (title: AllTagsTitle) => {
  const tag = allTags.find((tag) => tag.title === title);

  if (!tag) throw new NotFoundError(`Tag not found: ${title}`);
  if (!tag?.slug) throw new NotFoundError(`Slug not found: ${title}`);
  if (!tag?.emoji) throw new NotFoundError(`Emoji not found: ${title}`);

  return tag;
};

const isExistTag = <T extends TechTags | LifeTags | FashionTags>(targetTag: T, tagTitle: AllTagsTitle) => {
  if (!targetTag.map(extractTitle).includes(tagTitle)) throw new NotFoundError(`Tag not found: ${tagTitle}`);

  return true;
};

export const generateCategoryObject = (title: CategoryTitle) => {
  const { slug, emoji } = getCategoryFromTitle(title);

  return {
    title,
    slug,
    emoji,
  } satisfies Category;
};

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
