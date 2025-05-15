import type { LocalImageProps, RemoteImageProps } from "astro:assets";
import type { HTMLAttributes } from "astro/types";

export const alignClass = {
  top: {
    wrapper: "bg-top",
    image: "object-top",
  },
  center: {
    wrapper: "bg-center",
    image: "object-center",
  },
};

export type CustomImageProps = {
  wrapperProps?: HTMLAttributes<"div">;
  ambientMode?: boolean;
  align?: keyof typeof alignClass;
  canZoom?: boolean;
} & (LocalImageProps | RemoteImageProps);
