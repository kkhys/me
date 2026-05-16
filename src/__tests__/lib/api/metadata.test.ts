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

  describe("CI environment", () => {
    beforeEach(async () => {
      vi.resetModules();
      vi.stubEnv("CI", "true");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: vi.fn(),
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      vi.resetModules();
    });

    it("returns fallback metadata even in production when CI is set", async () => {
      const result = await getMetadata("https://ci-example.com");
      expect(result.title).toBe("リンク");
      expect(result.description).toBe("外部リンク");
    });
  });

  describe("production environment", () => {
    let mockFetchSiteMetadata: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
      vi.resetModules();
      vi.stubEnv("CI", "");
      mockFetchSiteMetadata = vi.fn().mockResolvedValue({
        title: "Example",
        description: "Example description",
        image: { src: "https://example.com/og.png", width: "1", height: "1" },
        icon: "https://example.com/favicon.ico",
      });
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
      }));
      vi.doMock("fetch-site-metadata", () => ({
        default: mockFetchSiteMetadata,
      }));
      const mod = await import("#/lib/api/metadata");
      getMetadata = mod.getMetadata;
    });

    afterEach(() => {
      vi.unstubAllEnvs();
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

    it("strips SVG og:image so Astro's sharp service won't reject the build", async () => {
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "SVG site",
        description: "desc",
        image: { src: "https://example.com/og.svg", width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata("https://svg-example.com");
      expect(result.image).toBeUndefined();
    });

    it("strips SVG og:image even when the URL has query params", async () => {
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "SVG site",
        description: "desc",
        image: {
          src: "https://example.com/og.svg?v=2#frag",
          width: "1",
          height: "1",
        },
        icon: undefined,
      });

      const result = await getMetadata("https://svg-query-example.com");
      expect(result.image).toBeUndefined();
    });

    it("keeps non-SVG og:image untouched", async () => {
      mockFetchSiteMetadata.mockResolvedValueOnce({
        title: "PNG site",
        description: "desc",
        image: { src: "https://example.com/og.png", width: "1", height: "1" },
        icon: undefined,
      });

      const result = await getMetadata("https://png-example.com");
      expect(result.image).toEqual({
        src: "https://example.com/og.png",
        width: "1",
        height: "1",
      });
    });
  });
});
