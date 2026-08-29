import { z } from "astro/zod";

export type CollectionKind = "works" | "fashion";

// The slug doubles as the image file (works) or directory (fashion) name.
export const orderedCaptionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  /** Position in the source YAML, attached by the caption file parser. */
  order: z.number().int().nonnegative(),
});

export type OrderedCaption = z.infer<typeof orderedCaptionSchema>;

export type Caption = Omit<OrderedCaption, "order">;

export type ImageModules<TImage> = Record<string, { default: TImage }>;

/**
 * Restore the YAML order (the data store returns entries sorted by id) and
 * drop `order`: from here on the array position is the display order.
 */
export const sortByOrder = (captions: readonly OrderedCaption[]): Caption[] =>
  captions.toSorted((a, b) => a.order - b.order).map(({ order: _order, ...caption }) => caption);

export interface ContentMismatch {
  kind: CollectionKind;
  /** Caption slugs with no image. */
  missingImages: readonly string[];
  /** Image keys with no caption. */
  orphanImages: readonly string[];
}

/**
 * A caption without an image, or an image without a caption, is an authoring
 * mistake in art-content. Fail the build so it is caught before deploy rather
 * than silently dropping a work.
 */
export class ContentMismatchError extends Error implements ContentMismatch {
  readonly kind: CollectionKind;
  readonly missingImages: readonly string[];
  readonly orphanImages: readonly string[];

  constructor({ kind, missingImages, orphanImages }: ContentMismatch) {
    const lines = [`Mismatch between ${kind} captions and images.`];
    if (missingImages.length > 0) {
      lines.push(`Captions without an image: ${missingImages.join(", ")}`);
    }
    if (orphanImages.length > 0) {
      lines.push(`Images without a caption: ${orphanImages.join(", ")}`);
    }
    super(lines.join("\n"));
    this.name = "ContentMismatchError";
    this.kind = kind;
    this.missingImages = missingImages;
    this.orphanImages = orphanImages;
  }
}

/**
 * Pair every caption with the image keyed by its slug, in caption order,
 * combining each pair with `pair`. Throws when either side has a leftover;
 * `strayImages` lets a caller add files it could not key at all (fashion
 * sheets without a numeric name).
 */
export const pairCaptionsWithImages = <TImage, TResult>(
  kind: CollectionKind,
  captions: readonly Caption[],
  images: ReadonlyMap<string, TImage>,
  pair: (caption: Caption, image: TImage) => TResult,
  strayImages: readonly string[] = [],
): TResult[] => {
  const pairs: TResult[] = [];
  const missingImages: string[] = [];
  for (const caption of captions) {
    const image = images.get(caption.slug);
    if (image === undefined) {
      missingImages.push(caption.slug);
    } else {
      pairs.push(pair(caption, image));
    }
  }

  const captioned = new Set(captions.map(({ slug }) => slug));
  const orphanImages = [...images.keys()]
    .filter((slug) => !captioned.has(slug))
    .concat(strayImages);
  if (missingImages.length > 0 || orphanImages.length > 0) {
    throw new ContentMismatchError({ kind, missingImages, orphanImages });
  }
  return pairs;
};
