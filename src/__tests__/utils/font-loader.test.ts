import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const fixturePath = path.resolve(__dirname, "../../__fixtures__/sample.txt");

describe("loadFont", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("reads a file and returns a Buffer", async () => {
    const { loadFont } = await import("#/utils/font-loader");
    const result = await loadFont(fixturePath);
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.toString()).toBe("hello");
  });

  it("returns cached result on second call (readFile called once)", async () => {
    const mockReadFile = vi.fn().mockResolvedValue(Buffer.from("cached"));

    vi.doMock("node:fs/promises", () => ({
      readFile: mockReadFile,
    }));

    const { loadFont } = await import("#/utils/font-loader");

    const result1 = await loadFont("/fake/path.ttf");
    const result2 = await loadFont("/fake/path.ttf");

    expect(result1).toBe(result2);
    expect(mockReadFile).toHaveBeenCalledTimes(1);
  });

  it("caches independently per path", async () => {
    const mockReadFile = vi
      .fn()
      .mockResolvedValueOnce(Buffer.from("font-a"))
      .mockResolvedValueOnce(Buffer.from("font-b"));

    vi.doMock("node:fs/promises", () => ({
      readFile: mockReadFile,
    }));

    const { loadFont } = await import("#/utils/font-loader");

    const resultA = await loadFont("/path/a.ttf");
    const resultB = await loadFont("/path/b.ttf");

    expect(resultA.toString()).toBe("font-a");
    expect(resultB.toString()).toBe("font-b");
    expect(mockReadFile).toHaveBeenCalledTimes(2);
  });

  it("throws when file does not exist", async () => {
    const mockReadFile = vi.fn().mockRejectedValue(new Error("ENOENT: no such file or directory"));

    vi.doMock("node:fs/promises", () => ({
      readFile: mockReadFile,
    }));

    const { loadFont } = await import("#/utils/font-loader");
    await expect(loadFont("/nonexistent/path.ttf")).rejects.toThrow("ENOENT");
  });
});
