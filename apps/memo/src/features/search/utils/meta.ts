import { searchConfig } from "#/features/search/config";

const { metaKeys } = searchConfig;

// `data-pagefind-meta` attribute values for the thread post. Pagefind parses an inline `key:value` capture up to the end of
// the attribute, so it must come last and each element can carry only one;
// the date is captured off the `<time>` element instead. Meta captures may
// sit outside `data-pagefind-body`.

export const buildAuthorMeta = (): string => metaKeys.author;

export const buildDateMeta = (): string => `${metaKeys.date}, ${metaKeys.datetime}[datetime]`;

// Pagefind stores meta as text, so the avatar goes in as the already-resolved
// image URL rather than an `[src]` capture off the responsive <img>.
export const buildAvatarMeta = (src: string): string => `${metaKeys.avatar}:${src}`;

// Blocks Pagefind's automatic `image` capture: the dialog shows the author's
// avatar from its own meta, and a memo's first attached image would otherwise
// be inlined into every fragment for nothing.
export const buildBodyMeta = (): string => "image:";
