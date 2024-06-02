import type { Base } from '..';
import { extractTitle } from '..';
import { fashionTags } from './fashion';
import { lifeTags } from './life';
import { techTags } from './tech';

export type Tag = Base;
export type AllTagsTitle = (typeof allTags)[number]['title'];

export const allTags = [...techTags, ...lifeTags, ...fashionTags];
export const allTagTitles = allTags.map(extractTitle);

export * from './tech';
export * from './life';
export * from './fashion';
