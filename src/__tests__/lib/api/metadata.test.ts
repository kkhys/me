import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

interface SiteMetadata {
  title: string | undefined;
  description: string | undefined;
  icon?: string | null | undefined;
  image?: unknown;
}

describe("getMetadata", () => {
  let getMetadata: (url: string) => Promise<SiteMetadata>;

  describe("non-production environment", () => {
    beforeEach(async () => {
      vi.resetModules();
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
        PUBLIC_VERCEL_ENV: "development",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: vi.fn(),
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.resetModules();
    });

    it("returns fallback metadata", async () => {
      const result = await getMetadata("https://example.com");
      expect(result.title).toBe("リンク");
      expect(result.description).toBe("外部リンク");
    });

    it("caches fallback metadata", async () => {
      const result1 = await getMetadata("https://cached-example.com");
      const result2 = await getMetadata("https://cached-example.com");
      expect(result1).toBe(result2);
    });
  });

  describe("production environment", () => {
    let mockFetchSiteMetadata: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      vi.resetModules();
      mockFetchSiteMetadata = vi.fn().mockResolvedValue({
        title: "Example",
        description: "Example description",
        image: "https://example.com/og.png",
        icon: "https://example.com/favicon.ico",
      });
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
        PUBLIC_VERCEL_ENV: "production",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: mockFetchSiteMetadata,
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.resetModules();
    });

    it("calls fetchSiteMetadata in production", async () => {
      await getMetadata("https://prod-example.com");
      expect(mockFetchSiteMetadata).toHaveBeenCalledWith(
        "https://prod-example.com",
        expect.objectContaining({
          suppressAdditionalRequest: true,
        }),
      );
    });

    it("returns fetched metadata", async () => {
      const result = await getMetadata("https://prod-example2.com");
      expect(result.title).toBe("Example");
    });

    it("returns fallback on fetch error", async () => {
      mockFetchSiteMetadata.mockRejectedValueOnce(new Error("Network error"));

      const result = await getMetadata("https://error-example.com");
      expect(result.title).toBe("Not Found");
      expect(result.description).toBe("Page not found");
    });
  });
});
