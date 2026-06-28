import { existsSync } from "node:fs";
import { readdir, rm, stat } from "node:fs/promises";
import { join, parse } from "node:path";
import { $ } from "bun";

const LGTM_DIR = "./lgtm-content/lgtm";
const TARGET_WIDTH = 2400;
const FPS = 12;
const DEFAULT_DURATION = 4;

const args = process.argv.slice(2);
const flagIndex = args.findIndex((a) => a === "-d" || a === "--duration");
const durationArg = flagIndex >= 0 ? args[flagIndex + 1] : undefined;
const duration = durationArg ? Number(durationArg) : DEFAULT_DURATION;
if (!Number.isFinite(duration) || duration <= 0) {
  console.error(`Error: invalid duration: ${durationArg}`);
  process.exit(1);
}

if (!existsSync(LGTM_DIR)) {
  console.error(`Error: ${LGTM_DIR} not found. Run 'git submodule update --init' first.`);
  process.exit(1);
}

const entryIds = await readdir(LGTM_DIR);
let converted = 0;
let failed = 0;

for (const entryId of entryIds) {
  const entryDir = join(LGTM_DIR, entryId);
  const entryStat = await stat(entryDir);
  if (!entryStat.isDirectory()) continue;

  const files = await readdir(entryDir);
  const movs = files.filter((f) => /\.mov$/i.test(f));
  if (movs.length === 0) continue;

  for (const mov of movs) {
    const movPath = join(entryDir, mov);
    const baseName = parse(mov).name;
    const webpName = `${baseName}.webp`;
    const webpPath = join(entryDir, webpName);

    console.log(`[convert] ${entryId}/${mov} → ${webpName} (max ${duration}s)`);

    try {
      // Clamp width with min() so a sub-2400 source is not upscaled.
      const vf = `fps=${FPS},scale='min(${TARGET_WIDTH},iw)':-2:flags=lanczos`;
      await $`ffmpeg -hide_banner -loglevel error -i ${movPath} -t ${duration} -vcodec libwebp -lossless 0 -compression_level 6 -q:v 75 -loop 0 -an -fps_mode passthrough -vf ${vf} -y ${webpPath}`;
    } catch (err) {
      console.error(`           ffmpeg failed: ${(err as Error).message}`);
      failed++;
      continue;
    }

    const sizeKB = Bun.file(webpPath).size / 1024;
    console.log(`           ${sizeKB.toFixed(1)} KB`);

    await rm(movPath);
    console.log(`           removed ${mov}`);
    converted++;
  }
}

console.log(`\n[done] converted ${converted}, failed ${failed}`);
if (failed > 0) process.exit(1);
