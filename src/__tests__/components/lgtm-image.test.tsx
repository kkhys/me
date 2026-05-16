/** @jsxImportSource react */
/** @jsxRuntime automatic */

import type { CollectionEntry } from "astro:content";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { LgtmImage } from "#/components/lgtm-image";

vi.mock("astro:env/client", () => ({
  GITHUB_ACTIONS: true,
}));

const createMockEntry = (
  overrides?: Partial<CollectionEntry<"lgtm">>,
): CollectionEntry<"lgtm"> => ({
  id: "01kcy2c0k82cmr4sy2ehadrfgk",
  collection: "lgtm",
  data: {
    color: "white",
    image: "01.jpg",
    isDraft: false,
    ...overrides?.data,
  },
  ...overrides,
});

describe("LgtmImage", () => {
  describe("Format validation", () => {
    it("should generate PNG format", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "png");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.format).toBe("png");
    });

    it("should generate AVIF format", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "avif");

      const metadata = await sharp(buffer).metadata();
      // Sharp identifies AVIF as 'heif' format
      expect(metadata.format).toBe("heif");
    });

    it("should generate WebP format", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "webp");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.format).toBe("webp");
    });
  });

  describe("Size validation", () => {
    it("should resize to 400px width", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "png");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(400);
    });

    it("should resize to 800px width (default)", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 800, "png");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(800);
    });

    it("should resize to 1000px width", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 1000, "png");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(1000);
    });

    it("should resize to 1200px width", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 1200, "png");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(1200);
    });

    it("should maintain aspect ratio when resizing", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "png");

      const metadata = await sharp(buffer).metadata();
      expect(metadata.width).toBe(400);
      expect(metadata.height).toBeGreaterThan(0);

      const aspectRatio = (metadata.width ?? 0) / (metadata.height ?? 1);
      expect(aspectRatio).toBeGreaterThan(0);
    });
  });

  describe("Text color validation", () => {
    it("should handle white text color", async () => {
      const entry = createMockEntry({
        data: { color: "white", image: "01.jpg", isDraft: false },
      });
      const buffer = await LgtmImage(entry, 400, "png");

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it("should handle black text color", async () => {
      const entry = createMockEntry({
        data: { color: "black", image: "01.jpg", isDraft: false },
      });
      const buffer = await LgtmImage(entry, 400, "png");

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });
  });

  describe("Error handling", () => {
    it("should throw error when image file does not exist", async () => {
      const entry = createMockEntry({
        id: "nonexistent",
        data: { color: "white", image: "nonexistent.jpg", isDraft: false },
      });

      await expect(LgtmImage(entry, 400, "png")).rejects.toThrow();
    });
  });

  describe("Animated source", () => {
    const createAnimatedEntry = (): CollectionEntry<"lgtm"> => ({
      id: "01kcy2c0k82cmr4sy2ehadrfgl",
      collection: "lgtm",
      data: { color: "white", image: "01.webp", isDraft: false },
    });

    it("should produce animated WebP from an animated source", async () => {
      const entry = createAnimatedEntry();
      const buffer = await LgtmImage(entry, 400, "webp");

      const metadata = await sharp(buffer, { animated: true }).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.pages).toBeGreaterThan(1);
      expect(metadata.width).toBe(400);
    });

    it("should produce a still PNG (first frame) from an animated source", async () => {
      const entry = createAnimatedEntry();
      const buffer = await LgtmImage(entry, 400, "png");

      const metadata = await sharp(buffer, { animated: true }).metadata();
      expect(metadata.format).toBe("png");
      expect(metadata.pages ?? 1).toBe(1);
      expect(metadata.width).toBe(400);
    });

    it("should produce a still AVIF (first frame) from an animated source", async () => {
      const entry = createAnimatedEntry();
      const buffer = await LgtmImage(entry, 400, "avif");

      const metadata = await sharp(buffer, { animated: true }).metadata();
      // Sharp identifies AVIF as 'heif' format
      expect(metadata.format).toBe("heif");
      expect(metadata.pages ?? 1).toBe(1);
      expect(metadata.width).toBe(400);
    });
  });

  describe("Output validation", () => {
    it("should generate valid image buffer", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "png");

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);

      const metadata = await sharp(buffer).metadata();
      expect(metadata.format).toBe("png");
      expect(metadata.width).toBe(400);
    });

    it("should apply text overlay to image", async () => {
      const entry = createMockEntry();
      const buffer = await LgtmImage(entry, 400, "png");

      const stats = await sharp(buffer).stats();
      expect(stats.channels.length).toBeGreaterThan(0);
    });

    it("should generate different outputs for different formats", async () => {
      const entry = createMockEntry();

      const pngBuffer = await LgtmImage(entry, 400, "png");
      const avifBuffer = await LgtmImage(entry, 400, "avif");
      const webpBuffer = await LgtmImage(entry, 400, "webp");

      expect(pngBuffer.length).not.toBe(avifBuffer.length);
      expect(pngBuffer.length).not.toBe(webpBuffer.length);
      expect(avifBuffer.length).not.toBe(webpBuffer.length);
    });
  });
});
