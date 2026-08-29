import { type Caption, type ImageModules, pairCaptionsWithImages } from "#/utils/caption";
import { parseSheetNumber } from "#/utils/sheet-number";

export interface FashionImage<TImage> {
  src: TImage;
  number: number;
}

export interface FashionSeries<TImage> extends Caption {
  images: FashionImage<TImage>[];
}

const SHEET_PATH_PATTERN = /\/fashion\/([^/]+)\/([^/]+)\.jpg$/u;

/**
 * Group `fashion/<slug>/<NN>.jpg` under the series caption, ordered by sheet
 * number. Files in a series directory that are not `NN.jpg` count as orphans.
 */
export const buildFashionSeries = <TImage>(
  captions: readonly Caption[],
  modules: ImageModules<TImage>,
): FashionSeries<TImage>[] => {
  const grouped = new Map<string, FashionImage<TImage>[]>();
  const strays: string[] = [];
  for (const [path, mod] of Object.entries(modules)) {
    const match = SHEET_PATH_PATTERN.exec(path);
    if (!match?.[1] || !match[2]) continue;
    const slug = match[1];
    const number = parseSheetNumber(match[2]);
    if (number === undefined) {
      strays.push(`${slug}/${match[2]}.jpg`);
      continue;
    }
    const images = grouped.get(slug) ?? [];
    // `1.jpg` and `01.jpg` would share a route and a view-transition-name.
    if (images.some((image) => image.number === number)) {
      throw new Error(`Duplicate sheet number ${number} in fashion/${slug}.`);
    }
    images.push({ src: mod.default, number });
    grouped.set(slug, images);
  }

  return pairCaptionsWithImages(
    "fashion",
    captions,
    grouped,
    (caption, images) => ({ ...caption, images: images.toSorted((a, b) => a.number - b.number) }),
    strays,
  );
};

export interface FashionSheet<TImage> {
  series: Caption;
  image: FashionImage<TImage>;
}

/** Every sheet in reading order, so prev/next can cross series boundaries. */
export const flattenFashionSheets = <TImage>(
  series: readonly FashionSeries<TImage>[],
): FashionSheet<TImage>[] =>
  series.flatMap(({ images, ...caption }) => images.map((image) => ({ series: caption, image })));
