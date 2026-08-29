import { type Caption, ContentMismatchError, type ImageModules } from "#/utils/caption";

export interface FashionImage<TImage> {
  src: TImage;
  number: number;
}

export interface FashionSeries<TImage> extends Caption {
  images: FashionImage<TImage>[];
}

const FASHION_PATH_PATTERN = /\/fashion\/([^/]+)\/(\d+)\.jpg$/u;

/**
 * Group images (`fashion/<slug>/<nn>.jpg`) under their series caption,
 * ordered by file number. Series order follows fashion.yaml.
 */
export const buildFashionSeries = <TImage>(
  captions: readonly Caption[],
  modules: ImageModules<TImage>,
): FashionSeries<TImage>[] => {
  const grouped = new Map<string, FashionImage<TImage>[]>();
  for (const [path, mod] of Object.entries(modules)) {
    const match = path.match(FASHION_PATH_PATTERN);
    if (!match?.[1] || !match[2]) continue;
    const images = grouped.get(match[1]) ?? [];
    images.push({ src: mod.default, number: Number(match[2]) });
    grouped.set(match[1], images);
  }

  const missing = captions.filter(({ slug }) => !grouped.has(slug)).map(({ slug }) => slug);
  const captioned = new Set(captions.map(({ slug }) => slug));
  const orphans = [...grouped.keys()].filter((slug) => !captioned.has(slug));
  if (missing.length > 0 || orphans.length > 0) {
    throw new ContentMismatchError("fashion", missing, orphans);
  }

  return captions.map((caption) => ({
    ...caption,
    images: (grouped.get(caption.slug) ?? []).toSorted((a, b) => a.number - b.number),
  }));
};

export interface FashionSheet<TImage> {
  series: FashionSeries<TImage>;
  image: FashionImage<TImage>;
}

/** Every sheet in reading order, so prev/next can cross series boundaries. */
export const flattenFashionSheets = <TImage>(
  series: readonly FashionSeries<TImage>[],
): FashionSheet<TImage>[] =>
  series.flatMap((entry) => entry.images.map((image) => ({ series: entry, image })));
