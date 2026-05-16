import type { APIContext } from "astro";
import { describe, expect, test, vi } from "vitest";
import { GET } from "#/pages/api/ids.json";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(async () => [
    {
      id: "01kcy2c0k82cmr4sy2ehadrfgk",
      collection: "lgtm",
      data: {
        image: "01.jpg",
        animated: false,
      },
    },
    {
      id: "01kczxdmaz63jrwfjcq8c1x2fj",
      collection: "lgtm",
      data: {
        image: "02.jpg",
        animated: false,
      },
    },
  ]),
}));

describe("GET /api/ids.json", () => {
  test("should return 200 status with correct headers", async () => {
    const response = await GET({} as unknown as APIContext);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=86400, must-revalidate",
    );
  });

  test("should return valid JSON with correct structure", async () => {
    const response = await GET({} as unknown as APIContext);
    const text = await response.text();
    const data = JSON.parse(text);

    expect(data).toHaveProperty("ids");
    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("updatedAt");

    expect(Array.isArray(data.ids)).toBe(true);
    expect(typeof data.count).toBe("number");
    expect(typeof data.updatedAt).toBe("string");
  });

  test("should have consistent count with ids array length", async () => {
    const response = await GET({} as unknown as APIContext);
    const text = await response.text();
    const data = JSON.parse(text);

    expect(data.count).toBe(data.ids.length);
  });

  test("should return valid ISO 8601 timestamp", async () => {
    const response = await GET({} as unknown as APIContext);
    const text = await response.text();
    const data = JSON.parse(text);

    const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(isoPattern.test(data.updatedAt)).toBe(true);

    const date = new Date(data.updatedAt);
    expect(date.toString()).not.toBe("Invalid Date");
  });

  test("should return lowercase ULIDs", async () => {
    const response = await GET({} as unknown as APIContext);
    const text = await response.text();
    const data = JSON.parse(text);

    const ulidPattern = /^[0123456789abcdefghjkmnpqrstvwxyz]{26}$/;
    for (const id of data.ids) {
      expect(typeof id).toBe("string");
      expect(ulidPattern.test(id)).toBe(true);
    }

    expect(data.count).toBeGreaterThan(0);
  });
});
