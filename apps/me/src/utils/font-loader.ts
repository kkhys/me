import { readFile } from "node:fs/promises";

const fontCache = new Map<string, Buffer>();

export const loadFont = async (path: string): Promise<Buffer> => {
  const cached = fontCache.get(path);
  if (cached) return cached;
  const buffer = await readFile(path);
  fontCache.set(path, buffer);
  return buffer;
};
