import { searchConfig } from "#/features/search/config";

const { metaKeys, filterKey } = searchConfig;

// `data-pagefind-meta` / `data-pagefind-filter` attribute values for the blog
// layout. Pagefind parses an inline `key:value` capture up to the end of the
// attribute, so it must come last and each element can carry only one; the
// date is captured off the `<time>` element instead. Meta captures may sit
// outside `data-pagefind-body`.

export const buildTitleMeta = (emoji: string): string =>
  `${metaKeys.title}, ${metaKeys.emoji}:${emoji}`;

export const buildDateMeta = (): string => `${metaKeys.date}, ${metaKeys.datetime}[datetime]`;

// Blocks Pagefind's automatic `image` capture (src of the first <img> after the
// h1): the dialog never shows it, and for posts that open with a mermaid
// diagram it would inline the whole SVG data URI into the fragment.
export const buildBodyMeta = (): string => "image:";

export const buildCategoryFilter = (category: string): string => `${filterKey}:${category}`;
