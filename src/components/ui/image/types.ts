import type { LocalImageProps, RemoteImageProps } from "astro:assets";

export type CustomImageProps = {
  ambientMode?: boolean;
} & (LocalImageProps | RemoteImageProps);
