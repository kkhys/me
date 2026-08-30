import type { Metadata } from "fetch-site-metadata";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMetadataFetcher } from "../link-metadata";

vi.mock("fetch-site-metadata", () => ({
  default: vi.fn<typeof import("fetch-site-metadata").default>(),
}));

const fetched = async () => (await import("fetch-site-metadata")).default;

const SITE: Metadata = {
  title: "Example",
  description: "An example site",
  image: undefined,
  icon: undefined,
};

describe("createMetadataFetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("disabled", () => {
    it("returns the placeholder without touching the network", async () => {
      const getMetadata = createMetadataFetcher({ enabled: false });
      await expect(getMetadata("https://example.com")).resolves.toEqual({
        title: "リンク",
        description: "外部リンク",
        image: undefined,
        icon: undefined,
      });
      expect(await fetched()).not.toHaveBeenCalled();
    });

    it("uses the app's placeholder and hands out one object per URL", async () => {
      const placeholder: Metadata = {
        title: "Link",
        description: "External link",
        image: undefined,
        icon: undefined,
      };
      const getMetadata = createMetadataFetcher({ enabled: false, placeholder });
      const first = await getMetadata("https://a.example");
      const again = await getMetadata("https://a.example");
      const other = await getMetadata("https://b.example");
      expect(first).toEqual(placeholder);
      expect(again).toBe(first);
      expect(other).toEqual(first);
      expect(other).not.toBe(first);
    });
  });

  describe("enabled", () => {
    it("fetches with the shared headers and caches per URL", async () => {
      vi.mocked(await fetched()).mockResolvedValue(SITE);
      const getMetadata = createMetadataFetcher({ enabled: true });

      const first = await getMetadata("https://example.com");
      const second = await getMetadata("https://example.com");

      expect(first).toEqual(SITE);
      expect(second).toBe(first);
      expect(await fetched()).toHaveBeenCalledTimes(1);
      expect(await fetched()).toHaveBeenCalledWith("https://example.com", {
        suppressAdditionalRequest: true,
        headers: {
          accept: "text/html",
          "accept-language": "ja,en-US;q=0.7,en;q=0.3",
        },
      });
    });

    it("resolves to Not Found on failure and retries on the next call", async () => {
      vi.mocked(await fetched())
        .mockRejectedValueOnce(new Error("network"))
        .mockResolvedValueOnce(SITE);
      const getMetadata = createMetadataFetcher({ enabled: true });

      await expect(getMetadata("https://example.com")).resolves.toEqual({
        title: "Not Found",
        description: "Page not found",
        image: undefined,
        icon: undefined,
      });
      await expect(getMetadata("https://example.com")).resolves.toEqual(SITE);
      expect(await fetched()).toHaveBeenCalledTimes(2);
    });

    it("drops an SVG og:image so the image pipeline never sees it", async () => {
      vi.mocked(await fetched()).mockResolvedValue({
        ...SITE,
        image: { src: "https://example.com/og.svg", width: "1200", height: "630", alt: "" },
      });
      const getMetadata = createMetadataFetcher({ enabled: true });
      const metadata = await getMetadata("https://example.com");
      expect(metadata.image).toBeUndefined();
    });
  });
});
