import type { LocalImageProps, RemoteImageProps } from "astro:assets";

export type CustomImageProps = (LocalImageProps | RemoteImageProps) & {
  /**
   * Whether landscape images with enough resolution break out beyond the body
   * width (wide display). Defaults to false so every image renders at the
   * unified body size. Flip the default (or pass `allowWide`) to restore the
   * previous large display.
   */
  allowWide?: boolean | undefined;
};
