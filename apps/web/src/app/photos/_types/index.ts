export type PhotoMetadata = Record<"slug" | "title", string>;

export type ImageObject = {
  width: number;
  height: number;
  blurDataURL: string;
};
