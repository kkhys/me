import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../memo-content/memo/**/*.{jpg,png}",
  { eager: true },
);

export const imageMap = new Map<string, ImageMetadata>(
  Object.entries(imageModules)
    .map(([path, module]) => {
      const match = path.match(/\/memo\/(.+)$/);
      if (!match) return null;
      const key = match[1];
      return [key, module.default] as const;
    })
    .filter(
      (entry): entry is readonly [string, ImageMetadata] => entry !== null,
    ),
);

export const getImage = (memoId: string, filename: string) => {
  const dirName = memoId.replace(/\/index\.md$/, "");
  const imagePath = `${dirName}/${filename}`;

  return imageMap.get(imagePath);
};

export const getImages = (memoId: string, imageFilenames: string[] = []) => {
  return imageFilenames
    .map((filename) => getImage(memoId, filename))
    .filter((img): img is ImageMetadata => img !== undefined);
};
