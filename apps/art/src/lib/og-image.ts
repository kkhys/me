import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export interface OgImage {
  src: string;
  width: number;
  height: number;
}

const OG_WIDTH = 1200;

/** The page's own work as a variable-height JPEG, not a fixed 1200x630 card. */
export const buildOgImage = async (image: ImageMetadata): Promise<OgImage> => {
  const { src } = await getImage({ src: image, width: OG_WIDTH, format: "jpg", quality: 80 });
  return {
    src,
    width: OG_WIDTH,
    height: Math.round((OG_WIDTH * image.height) / image.width),
  };
};
