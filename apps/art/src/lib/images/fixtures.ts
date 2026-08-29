import type { ImageMetadata } from "astro";
import type { ImageModules } from "#/utils/caption";

export const workModules: ImageModules<ImageMetadata> = import.meta.glob(
  "../../__fixtures__/works/*.jpg",
  { eager: true },
);

export const fashionModules: ImageModules<ImageMetadata> = import.meta.glob(
  "../../__fixtures__/fashion/*/*.jpg",
  { eager: true },
);
