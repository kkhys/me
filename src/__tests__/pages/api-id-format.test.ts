import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, getStaticPaths } from "#/pages/[id].[format]";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(async () => [
    {
      id: "01kcy2c0k82cmr4sy2ehadrfgk",
      collection: "lgtm",
      data: {
        image: "01.jpg",
        isDraft: false,
      },
    },
  ]),
}));

vi.mock("#/components/lgtm-image", () => ({
  LgtmImage: vi.fn(async () => Buffer.from("mock-image-data")),
}));

describe("[id].[format].ts API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStaticPaths", () => {
    it("should generate paths for all formats", async () => {
      const paths = await getStaticPaths();

      expect(paths).toHaveLength(3); // png, avif, webp
      expect(paths).toEqual(
        expect.arrayContaining([
          {
            params: {
              id: "01kcy2c0k82cmr4sy2ehadrfgk",
              format: "png",
            },
          },
          {
            params: {
              id: "01kcy2c0k82cmr4sy2ehadrfgk",
              format: "avif",
            },
          },
          {
            params: {
              id: "01kcy2c0k82cmr4sy2ehadrfgk",
              format: "webp",
            },
          },
        ]),
      );
    });
  });

  describe("GET handler", () => {
    it("should return image with correct content type for PNG", async () => {
      const context = {
        params: { id: "01kcy2c0k82cmr4sy2ehadrfgk", format: "png" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("image/png");
      expect(response.headers.get("Cache-Control")).toBe(
        "public, max-age=31536000, immutable",
      );
    });

    it("should return image with correct content type for AVIF", async () => {
      const context = {
        params: { id: "01kcy2c0k82cmr4sy2ehadrfgk", format: "avif" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.headers.get("Content-Type")).toBe("image/avif");
    });

    it("should return image with correct content type for WebP", async () => {
      const context = {
        params: { id: "01kcy2c0k82cmr4sy2ehadrfgk", format: "webp" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.headers.get("Content-Type")).toBe("image/webp");
    });

    it("should default to PNG for invalid format", async () => {
      const context = {
        params: { id: "01kcy2c0k82cmr4sy2ehadrfgk", format: "invalid" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.headers.get("Content-Type")).toBe("image/png");
    });

    it("should return 404 for non-existent entry", async () => {
      const context = {
        params: { id: "nonexistent", format: "png" },
      } as unknown as APIContext;

      const response = await GET(context);

      expect(response.status).toBe(404);
      expect(await response.text()).toBe("Not found");
    });

    it("should set immutable cache control header", async () => {
      const context = {
        params: { id: "01kcy2c0k82cmr4sy2ehadrfgk", format: "png" },
      } as unknown as APIContext;

      const response = await GET(context);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("max-age=31536000");
      expect(cacheControl).toContain("immutable");
    });

    it("should return Uint8Array for valid request", async () => {
      const context = {
        params: { id: "01kcy2c0k82cmr4sy2ehadrfgk", format: "png" },
      } as unknown as APIContext;

      const response = await GET(context);

      const body = await response.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });
  });
});
