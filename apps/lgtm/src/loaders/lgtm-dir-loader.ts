import { existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import type { Loader, LoaderContext } from "astro/loaders";
import sharp from "sharp";

const MEDIA_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const isMediaFile = (name: string) => {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return false;
  return MEDIA_EXTENSIONS.has(name.slice(dot).toLowerCase());
};

const pickImage = async (entryDir: string): Promise<string | null> => {
  const files = await readdir(entryDir);
  // Ascending sort so a directory holding e.g. `01.jpg` and `02.jpg` always
  // resolves to the same entry across rebuilds.
  files.sort();
  return files.find((file) => isMediaFile(file)) ?? null;
};

const isAnimated = async (filePath: string): Promise<boolean> => {
  const meta = await sharp(filePath, { animated: true }).metadata();
  return (meta.pages ?? 1) > 1;
};

const loadEntries = async (
  baseDir: string,
  { store, parseData, generateDigest, config, logger }: LoaderContext,
) => {
  store.clear();

  if (!existsSync(baseDir)) {
    logger.warn(`lgtm directory not found: ${baseDir}`);
    return;
  }

  const siteRoot = config.root.pathname;
  const dirents = await readdir(baseDir);
  for (const id of dirents) {
    const entryDir = join(baseDir, id);
    const entryStat = await stat(entryDir);
    if (!entryStat.isDirectory()) continue;

    const image = await pickImage(entryDir);
    if (!image) {
      logger.warn(`No media file in ${entryDir} — skipping`);
      continue;
    }

    const animated = await isAnimated(join(entryDir, image));
    const data = await parseData({ id, data: { image, animated } });
    store.set({
      id,
      data,
      digest: generateDigest(data),
      filePath: relative(siteRoot, join(entryDir, image)),
    });
  }
};

export const lgtmDirLoader = ({ base }: { base: string }): Loader => {
  const baseDir = resolve(base);

  return {
    name: "lgtm-dir-loader",
    load: async (context) => {
      await loadEntries(baseDir, context);

      // In dev, refresh the store when files appear or disappear under the
      // base directory so adding a new ULID dir shows up without restarting.
      context.watcher?.add(baseDir);
      const reload = () => loadEntries(baseDir, context);
      context.watcher?.on("add", reload);
      context.watcher?.on("unlink", reload);
      context.watcher?.on("addDir", reload);
      context.watcher?.on("unlinkDir", reload);
    },
  };
};
