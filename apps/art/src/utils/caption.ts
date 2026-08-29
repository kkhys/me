export interface Caption {
  slug: string;
  title: string;
  year: number;
}

export interface OrderedCaption extends Caption {
  /** Position in the source YAML, which is the display order. */
  order: number;
}

export type ImageModules<TImage> = Record<string, { default: TImage }>;

export const sortByOrder = <T extends OrderedCaption>(captions: readonly T[]): T[] =>
  captions.toSorted((a, b) => a.order - b.order);

/**
 * A caption without an image, or an image without a caption, is an authoring
 * mistake in art-content. Fail the build so it is caught before deploy rather
 * than silently dropping a work.
 */
export class ContentMismatchError extends Error {
  constructor(kind: "works" | "fashion", missingImages: string[], orphanImages: string[]) {
    const lines = [`Mismatch between ${kind} captions and images.`];
    if (missingImages.length > 0) {
      lines.push(`Captions without an image: ${missingImages.join(", ")}`);
    }
    if (orphanImages.length > 0) {
      lines.push(`Images without a caption: ${orphanImages.join(", ")}`);
    }
    super(lines.join("\n"));
    this.name = "ContentMismatchError";
  }
}
