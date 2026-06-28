import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "../../memo-content/memo/**/*.{jpg,png}",
  { eager: true },
);

const imageMap = new Map<string, ImageMetadata>(
  Object.entries(imageModules)
    .map(([path, module]) => {
      const match = path.match(/\/memo\/(.+)$/u);
      if (!match) return null;
      const key = match[1];
      return [key, module.default] as const;
    })
    .filter((entry): entry is readonly [string, ImageMetadata] => entry !== null),
);

export const getImagesForMemo = (memoId: string) => {
  const dirName = memoId.replace(/\/index\.md$/u, "");
  const prefix = `${dirName}/`;

  return Array.from(imageMap.entries())
    .filter(([key]) => key.startsWith(prefix))
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([, image]) => image);
};
