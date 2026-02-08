import { describe, expect, it } from "vitest";
import { getBlogPostingSchema, websiteSchema } from "#/lib/json-ld";

describe("websiteSchema", () => {
  it("has correct @context", () => {
    expect(websiteSchema["@context"]).toBe("https://schema.org");
  });

  it("has correct @type", () => {
    expect(websiteSchema["@type"]).toBe("WebSite");
  });

  it("has url from import.meta.env.SITE", () => {
    expect(websiteSchema.url).toBe("https://example.com");
  });

  it("has name and description", () => {
    expect(websiteSchema.name).toBe("Keisuke Hayashi");
    expect(websiteSchema.description).toBe("Keisuke Hayashi の個人サイト");
  });
});

describe("getBlogPostingSchema", () => {
  const baseData = {
    title: "Test Post",
    description: "A test blog post",
    emoji: "🧪",
    category: "Tech" as const,
    publishedAt: new Date("2024-01-15T00:00:00Z"),
    status: "published" as const,
  };

  it("returns correct BlogPosting schema", () => {
    const schema = getBlogPostingSchema({
      id: "test123",
      data: baseData,
    });

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("Test Post");
    expect(schema.description).toBe("A test blog post");
  });

  it("throws error for invalid category", () => {
    expect(() =>
      getBlogPostingSchema({
        id: "test123",
        data: { ...baseData, category: "Invalid" as any },
      }),
    ).toThrow("Category not found: Invalid");
  });

  it("generates keywords from tags", () => {
    const schema = getBlogPostingSchema({
      id: "test123",
      data: { ...baseData, tags: ["TypeScript", "React"] },
    });

    expect(schema.keywords).toContain("TypeScript");
    expect(schema.keywords).toContain("React");
  });

  it("falls back to raw tag title when tag is not found in config", () => {
    const schema = getBlogPostingSchema({
      id: "test123",
      data: { ...baseData, tags: ["NonExistentTag"] },
    });

    expect(schema.keywords).toBe("NonExistentTag");
  });

  it("uses updatedAt for dateModified when available", () => {
    const schema = getBlogPostingSchema({
      id: "test123",
      data: {
        ...baseData,
        updatedAt: new Date("2024-06-01T00:00:00Z"),
      },
    });

    expect(schema.dateModified).toBe("2024-06-01T00:00:00.000Z");
  });

  it("uses publishedAt for dateModified when updatedAt is absent", () => {
    const schema = getBlogPostingSchema({
      id: "test123",
      data: baseData,
    });

    expect(schema.dateModified).toBe("2024-01-15T00:00:00.000Z");
    expect(schema.datePublished).toBe("2024-01-15T00:00:00.000Z");
  });

  it("includes correct URL with id", () => {
    const schema = getBlogPostingSchema({
      id: "abc123",
      data: baseData,
    });

    expect(schema.url).toBe("https://example.com/blog/posts/abc123");
  });

  it("sets articleSection to category label", () => {
    const schema = getBlogPostingSchema({
      id: "test123",
      data: baseData,
    });

    expect(schema.articleSection).toBe("プログラミング");
  });
});
