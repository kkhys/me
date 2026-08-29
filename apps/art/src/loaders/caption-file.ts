import { readFileSync } from "node:fs";
import { parse } from "yaml";

const isMapping = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Parse a caption YAML array, attaching each item's position as `order`. The
 * data store hands entries back sorted by id, so the position has to travel
 * with the item for it to double as the display order.
 */
export const parseCaptionYaml = (text: string): Record<string, unknown>[] => {
  const items: unknown = parse(text);
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("Caption files must be a non-empty YAML array.");
  }
  const seen = new Set<string>();
  return items.map((item: unknown, order) => {
    if (!isMapping(item)) {
      throw new TypeError(`Caption at position ${order} must be a mapping.`);
    }
    const { slug } = item;
    if (typeof slug === "string") {
      // The file loader would warn and keep the last one, silently dropping a work.
      if (seen.has(slug)) throw new TypeError(`Duplicate slug "${slug}".`);
      seen.add(slug);
    }
    return Object.assign(item, { order });
  });
};

/**
 * Read and validate a caption file up front. Astro's `file()` loader catches
 * parser errors, logs one line, and yields an empty collection, so a throw
 * here is what actually stops the build — and names a missing submodule.
 */
export const readCaptionFile = (path: string): Record<string, unknown>[] => {
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (error) {
    throw new Error(
      `Cannot read ${path}. Initialize the art-content submodule or set USE_FIXTURE_DATA=true.`,
      { cause: error },
    );
  }
  try {
    return parseCaptionYaml(text);
  } catch (error) {
    throw new Error(`Invalid caption file ${path}: ${(error as Error).message}`, { cause: error });
  }
};
