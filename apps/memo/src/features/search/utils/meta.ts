import { searchConfig } from "#/features/search/config";

const { metaKeys } = searchConfig;

// `data-pagefind-meta` attribute values for the thread post. Pagefind parses
// an inline `key:value` capture up to the end of the attribute, so it must
// come last and each element can carry only one. Meta captures may sit
// outside `data-pagefind-body`.

export const buildAuthorMeta = (): string => metaKeys.author;

/** The visible date and the machine-readable attribute of the same `<time>`. */
export const buildDateMeta = (): string => `${metaKeys.date}, ${metaKeys.datetime}[datetime]`;

// The avatar is inlined as a resolved URL rather than captured off the <img>
// with `[src]`: the shared Avatar component's `src` is the 1x rendition, and
// the 2x the dialog wants exists only in its `srcset`.
export const buildAvatarMeta = (src: string): string => `${metaKeys.avatar}:${src}`;
