import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, getStaticPaths } from "#/pages/[id]-[size].[format]";

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

describe("[id]-[size].[format].ts API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStaticPaths", () => {
    it("should generate paths for all format and size combinations", async () => {
      const paths = await getStaticPaths();

      // 3 formats × 3 sizes = 9 combinations
      expect(paths).toHaveLength(9);

      // Verify all size variations exist
      const sizes = ["400", "1000", "1200"];
      const formats = ["png", "avif", "webp"];

      for (const size of sizes) {
        for (const format of formats) {
          expect(paths).toContainEqual({
            params: {
              id: "01kcy2c0k82cmr4sy2ehadrfgk",
              size,
              format,
            },
          });
        }
      }
    });
  });

  describe("GET handler", () => {
    describe("Format validation", () => {
      it("should return image with correct content type for PNG", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.headers.get("Content-Type")).toBe("image/png");
      });

      it("should return image with correct content type for AVIF", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "avif",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.headers.get("Content-Type")).toBe("image/avif");
      });

      it("should return image with correct content type for WebP", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "webp",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.headers.get("Content-Type")).toBe("image/webp");
      });

      it("should default to PNG for invalid format", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "invalid",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.headers.get("Content-Type")).toBe("image/png");
      });
    });

    describe("Size validation", () => {
      it("should handle 400px size", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("image/png");
      });

      it("should handle 1000px size", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "1000",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("image/png");
      });

      it("should handle 1200px size", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "1200",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("image/png");
      });

      it("should default to 400px for invalid size", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "9999",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("image/png");
      });
    });

    describe("Error handling", () => {
      it("should return 404 for non-existent entry", async () => {
        const context = {
          params: { id: "nonexistent", size: "400", format: "png" },
        } as unknown as APIContext;

        const response = await GET(context);

        expect(response.status).toBe(404);
        expect(await response.text()).toBe("Not found");
      });
    });

    describe("Response headers", () => {
      it("should set immutable cache control header", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        const cacheControl = response.headers.get("Cache-Control");
        expect(cacheControl).toContain("public");
        expect(cacheControl).toContain("max-age=31536000");
        expect(cacheControl).toContain("immutable");
      });

      it("should return valid image data", async () => {
        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "400",
            format: "png",
          },
        } as unknown as APIContext;

        const response = await GET(context);

        const body = await response.arrayBuffer();
        expect(body.byteLength).toBeGreaterThan(0);
      });
    });

    describe("Integration with LgtmImage", () => {
      it("should call LgtmImage with correct width parameter", async () => {
        const { LgtmImage } = await import("#/components/lgtm-image");

        const context = {
          params: {
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
            size: "1000",
            format: "png",
          },
        } as unknown as APIContext;

        await GET(context);

        expect(LgtmImage).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "01kcy2c0k82cmr4sy2ehadrfgk",
          }),
          1000,
          "png",
        );
      });
    });
  });
});
