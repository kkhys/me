import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// memo-images.astro sizes the gallery through :global() selectors that reach
// into BlurImage's markup. Those rules die silently when the package renames a
// class (it once shipped .blur-load-wrapper), so pin every reached class to
// one BlurImage actually emits.
const memoImages = readFileSync(
  path.resolve(__dirname, "../../components/memo-images.astro"),
  "utf8",
);
const blurImage = readFileSync(
  path.resolve(__dirname, "../../../node_modules/@kkhys/ui/src/blur-image.astro"),
  "utf8",
);

const globalClasses = [...memoImages.matchAll(/:global\(\.([\w-]+)/gu)].map((m) => m[1]);
const emittedClasses = new Set(
  [...blurImage.matchAll(/class(?::list)?=(?:"([^"]*)"|\{\[\s*"([^"]*)")/gu)].flatMap((m) =>
    (m[1] ?? m[2] ?? "").split(/\s+/u).filter(Boolean),
  ),
);

describe("memo-images gallery selectors", () => {
  it("reaches into BlurImage", () => {
    expect(globalClasses.length).toBeGreaterThan(0);
  });

  it.each([...new Set(globalClasses)])("targets a class BlurImage emits: .%s", (className) => {
    expect(emittedClasses).toContain(className);
  });
});
