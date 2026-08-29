import { type Caption, ContentMismatchError, type ImageModules } from "#/utils/caption";

export interface Work<TImage> extends Caption {
  src: TImage;
}

const WORK_PATH_PATTERN = /\/works\/([^/]+)\.jpg$/u;

/**
 * Pair each caption with its image (`works/<slug>.jpg`), preserving the
 * caption order from works.yaml, which is the display order.
 */
export const buildWorks = <TImage>(
  captions: readonly Caption[],
  modules: ImageModules<TImage>,
): Work<TImage>[] => {
  const images = new Map<string, TImage>();
  for (const [path, mod] of Object.entries(modules)) {
    const slug = path.match(WORK_PATH_PATTERN)?.[1];
    if (slug) images.set(slug, mod.default);
  }

  const missing = captions.filter(({ slug }) => !images.has(slug)).map(({ slug }) => slug);
  const captioned = new Set(captions.map(({ slug }) => slug));
  const orphans = [...images.keys()].filter((slug) => !captioned.has(slug));
  if (missing.length > 0 || orphans.length > 0) {
    throw new ContentMismatchError("works", missing, orphans);
  }

  return captions.map((caption) => ({ ...caption, src: images.get(caption.slug) as TImage }));
};
