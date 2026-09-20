import type { Metadata } from "fetch-site-metadata";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  errorFallbackMetadata,
  fallbackMetadata,
  mockMetadata,
  mockMetadataMinimal,
} from "#/__fixtures__/metadata";

vi.mock("fetch-site-metadata", () => ({
  default: vi.fn<typeof import("fetch-site-metadata").default>(),
}));

vi.mock("#/lib/link-metadata-cache", () => ({
  readLinkMetadata: vi.fn<typeof import("#/lib/link-metadata-cache").readLinkMetadata>(() => ({})),
}));

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const EMPTY_PAGE = "<!doctype html><html><head><title></title></head><body></body></html>";

describe("getMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("non-production environment", () => {
    beforeEach(() => {
      vi.doUnmock("astro:env/client");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
        PUBLIC_DEPLOY_ENV: undefined,
      }));
    });

    test("should return fallback metadata in development", async () => {
      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://example.com");

      expect(result).toEqual(fallbackMetadata);
    });

    test("should cache fallback metadata for same URL", async () => {
      const { getMetadata } = await import("#/lib/metadata");

      const firstCall = await getMetadata("https://example.com");
      const secondCall = await getMetadata("https://example.com");

      expect(firstCall).toBe(secondCall);
    });

    test("should return different fallback metadata for different URLs", async () => {
      const { getMetadata } = await import("#/lib/metadata");

      const firstResult = await getMetadata("https://example.com");
      const secondResult = await getMetadata("https://different.com");

      expect(firstResult).toEqual(secondResult);
      expect(firstResult).not.toBe(secondResult);
    });
  });

  describe("production environment", () => {
    beforeEach(() => {
      vi.doUnmock("astro:env/client");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
        PUBLIC_DEPLOY_ENV: "production",
      }));
      // The shared fetcher reads the page itself to check the HTTP status, then
      // sniffs og:image bytes before keeping the image. Answer each request in
      // kind, and build a fresh Response every time: a body reads only once.
      vi.stubGlobal(
        "fetch",
        // Typed from the call signature rather than `typeof fetch`: astro check
        // resolves bun's lib, which declares static members on it.
        vi.fn<(input: string | URL | Request, options?: RequestInit) => Promise<Response>>(
          (_input, options) =>
            Promise.resolve(
              (options?.headers as Record<string, string> | undefined)?.accept === "image/*"
                ? new Response(PNG_BYTES, { headers: { "content-type": "image/png" } })
                : new Response(EMPTY_PAGE, {
                    headers: { "content-type": "text/html; charset=utf-8" },
                  }),
            ),
        ),
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    test("should fetch and return site metadata", async () => {
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata).mockResolvedValue(mockMetadata);

      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://example.com");

      expect(result).toEqual(mockMetadata);
      expect(fetchSiteMetadata).toHaveBeenCalledWith("https://example.com", {
        suppressAdditionalRequest: true,
        headers: {
          accept: "text/html",
          "accept-language": "ja,en-US;q=0.7,en;q=0.3",
        },
      });
    });

    test("should cache fetched metadata", async () => {
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata).mockResolvedValue(mockMetadata);

      const { getMetadata } = await import("#/lib/metadata");

      const firstCall = await getMetadata("https://example.com");
      const secondCall = await getMetadata("https://example.com");

      expect(firstCall).toBe(secondCall);
      expect(fetchSiteMetadata).toHaveBeenCalledTimes(1);
    });

    test("should return fallback metadata when fetch fails", async () => {
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata).mockRejectedValue(new Error("Network error"));

      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://example.com");

      expect(result).toEqual(errorFallbackMetadata);
    });

    test("should not cache fallback metadata when fetch fails", async () => {
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata).mockRejectedValue(new Error("Network error"));

      const { getMetadata } = await import("#/lib/metadata");

      await getMetadata("https://example.com");
      await getMetadata("https://example.com");

      expect(fetchSiteMetadata).toHaveBeenCalledTimes(2);
    });

    test("should handle different URLs independently", async () => {
      const mockMetadata1: Metadata = {
        title: "Site 1",
        description: "Description 1",
        image: undefined,
        icon: undefined,
      };

      const mockMetadata2: Metadata = {
        title: "Site 2",
        description: "Description 2",
        image: undefined,
        icon: undefined,
      };

      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata)
        .mockResolvedValueOnce(mockMetadata1)
        .mockResolvedValueOnce(mockMetadata2);

      const { getMetadata } = await import("#/lib/metadata");

      const result1 = await getMetadata("https://example1.com");
      const result2 = await getMetadata("https://example2.com");

      expect(result1).toEqual(mockMetadata1);
      expect(result2).toEqual(mockMetadata2);
      expect(fetchSiteMetadata).toHaveBeenCalledTimes(2);
    });

    test("should answer from the committed cache without fetching", async () => {
      const { readLinkMetadata } = await import("#/lib/link-metadata-cache");
      vi.mocked(readLinkMetadata).mockReturnValueOnce({ "https://cached.com": mockMetadata });
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;

      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://cached.com");

      expect(result).toEqual(mockMetadata);
      expect(fetchSiteMetadata).not.toHaveBeenCalled();
    });

    test("should fetch a URL the cache does not cover", async () => {
      const { readLinkMetadata } = await import("#/lib/link-metadata-cache");
      vi.mocked(readLinkMetadata).mockReturnValueOnce({ "https://cached.com": mockMetadata });
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata).mockResolvedValue(mockMetadataMinimal);

      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://example.com");

      expect(result).toEqual(mockMetadataMinimal);
      expect(fetchSiteMetadata).toHaveBeenCalledTimes(1);
    });

    test("should handle fetch success after previous failure for different URL", async () => {
      const fetchSiteMetadata = (await import("fetch-site-metadata")).default;
      vi.mocked(fetchSiteMetadata)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(mockMetadataMinimal);

      const { getMetadata } = await import("#/lib/metadata");

      const failResult = await getMetadata("https://fail.com");
      const successResult = await getMetadata("https://success.com");

      expect(failResult).toEqual(errorFallbackMetadata);
      expect(successResult).toEqual(mockMetadataMinimal);
    });
  });

  describe("edge cases", () => {
    test("should handle NODE_ENV=production with non-production PUBLIC_DEPLOY_ENV", async () => {
      vi.doUnmock("astro:env/client");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "production",
        PUBLIC_DEPLOY_ENV: "preview",
      }));

      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://example.com");

      expect(result).toEqual(fallbackMetadata);
    });

    test("should handle NODE_ENV=development with production PUBLIC_DEPLOY_ENV", async () => {
      vi.doUnmock("astro:env/client");
      vi.doMock("astro:env/client", () => ({
        NODE_ENV: "development",
        PUBLIC_DEPLOY_ENV: "production",
      }));

      const { getMetadata } = await import("#/lib/metadata");
      const result = await getMetadata("https://example.com");

      expect(result).toEqual(fallbackMetadata);
    });
  });
});
