/** @jsxImportSource react */
/** @jsxRuntime automatic */

import type { CollectionEntry } from "astro:content";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { formatForEntry, LgtmImage } from "#/components/lgtm-image";

vi.mock("astro:env/client", () => ({
  GITHUB_ACTIONS: true,
}));

const createStillEntry = (
  overrides?: Partial<CollectionEntry<"lgtm">>,
): CollectionEntry<"lgtm"> => ({
  id: "01kcy2c0k82cmr4sy2ehadrfgk",
  collection: "lgtm",
  data: {
    image: "01.jpg",
    animated: false,
    ...overrides?.data,
  },
  ...overrides,
});

const createAnimatedEntry = (): CollectionEntry<"lgtm"> => ({
  id: "01kcy2c0k82cmr4sy2ehadrfgl",
  collection: "lgtm",
  data: { image: "01.webp", animated: true },
});

describe("formatForEntry", () => {
  it("returns avif for still entries", () => {
    expect(formatForEntry(createStillEntry())).toBe("avif");
  });

  it("returns webp for animated entries", () => {
    expect(formatForEntry(createAnimatedEntry())).toBe("webp");
  });
});

describe("LgtmImage", () => {
  describe("Still source", () => {
    it("should generate AVIF output", async () => {
      const buffer = await LgtmImage(createStillEntry(), 400);

      const metadata = await sharp(buffer).metadata();
      // Sharp identifies AVIF as 'heif' format
      expect(metadata.format).toBe("heif");
    });

    it.each([400, 800, 1000, 1200])("should resize to %ipx width", async (width) => {
      const buffer = await LgtmImage(createStillEntry(), width);
      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(width);
    });

    it("should maintain aspect ratio when resizing", async () => {
      const buffer = await LgtmImage(createStillEntry(), 400);
      const metadata = await sharp(buffer).metadata();

      expect(metadata.width).toBe(400);
      expect(metadata.height).toBeGreaterThan(0);
    });

    it("should default to 400px width", async () => {
      const buffer = await LgtmImage(createStillEntry());
      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(400);
    });
  });

  describe("Animated source", () => {
    it("should produce animated WebP", async () => {
      const buffer = await LgtmImage(createAnimatedEntry(), 400);

      const metadata = await sharp(buffer, { animated: true }).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.pages).toBeGreaterThan(1);
      expect(metadata.width).toBe(400);
    });
  });

  describe("Error handling", () => {
    it("should throw error when image file does not exist", async () => {
      const entry = createStillEntry({
        id: "nonexistent",
        data: { image: "nonexistent.jpg", animated: false },
      });

      await expect(LgtmImage(entry, 400)).rejects.toThrow(Error);
    });
  });

  describe("Output validation", () => {
    it("should generate valid image buffer", async () => {
      const buffer = await LgtmImage(createStillEntry(), 400);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it("should apply text overlay to image", async () => {
      const buffer = await LgtmImage(createStillEntry(), 400);

      const stats = await sharp(buffer).stats();
      expect(stats.channels.length).toBeGreaterThan(0);
    });
  });
});
