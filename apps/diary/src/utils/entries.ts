export interface DiaryEntry<TImage> {
  src: TImage;
  date: string;
  fileNumber: string;
  number: number;
}

const ENTRY_PATH_PATTERN = /\/(\d{4}-\d{2}-\d{2})\/(\d+)\.jpg$/u;

/**
 * Turn glob-loaded diary photos into entries ordered newest first, with
 * 1-based numbers assigned in chronological order (date, then file number)
 * so a photo keeps its number as new ones are added.
 */
export const buildEntries = <TImage>(
  modules: Record<string, { default: TImage }>,
): DiaryEntry<TImage>[] =>
  Object.entries(modules)
    .map(([path, mod]) => {
      const match = path.match(ENTRY_PATH_PATTERN);
      if (!match?.[1] || !match[2]) return null;
      return { src: mod.default, date: match[1], fileNumber: match[2] };
    })
    .filter((entry) => entry !== null)
    // Compare the file number numerically: "10" sorts before "2" as text.
    .toSorted((a, b) => a.date.localeCompare(b.date) || Number(a.fileNumber) - Number(b.fileNumber))
    .map((entry, i) => ({
      src: entry.src,
      date: entry.date,
      fileNumber: entry.fileNumber,
      number: i + 1,
    }))
    .toReversed();
