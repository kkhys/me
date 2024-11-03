import type { Base } from '..';
import { extractTitle } from '../../../lib/contentlayer/utils';
import { buildTags, lifeTags, objectTags, techTags } from '../tag';

export type Tag = Base;
export type AllTagsTitle = (typeof allTags)[number]['title'];

export const allTags = [...buildTags, ...lifeTags, ...objectTags, ...techTags];
export const allTagTitles = allTags.map(extractTitle);

export * from './build';
export * from './life';
export * from './object';
export * from './tech';
