import type { ImageMetadata } from "astro";

export interface MemoImage {
  /** File name inside the memo directory, e.g. `01.jpg`; matches `images[].file` in the frontmatter. */
  file: string;
  src: ImageMetadata;
}

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

export const getImagesForMemo = (memoId: string): MemoImage[] => {
  const dirName = memoId.replace(/\/index\.md$/u, "");
  const prefix = `${dirName}/`;

  return Array.from(imageMap.entries())
    .filter(([key]) => key.startsWith(prefix))
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([key, src]) => ({ file: key.slice(prefix.length), src }));
};
