import { type Caption, type ImageModules, pairCaptionsWithImages } from "#/utils/caption";

export interface Work<TImage> extends Caption {
  src: TImage;
}

const WORK_PATH_PATTERN = /\/works\/([^/]+)\.jpg$/u;

/** The image for a caption is `works/<slug>.jpg`. */
export const buildWorks = <TImage>(
  captions: readonly Caption[],
  modules: ImageModules<TImage>,
): Work<TImage>[] => {
  const images = new Map<string, TImage>();
  for (const [path, mod] of Object.entries(modules)) {
    const slug = WORK_PATH_PATTERN.exec(path)?.[1];
    if (slug) images.set(slug, mod.default);
  }

  return pairCaptionsWithImages("works", captions, images, (caption, src) => ({
    ...caption,
    src,
  }));
};
