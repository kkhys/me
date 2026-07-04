import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ulid } from "ulid";
import { countMemoChars, createMemo, formatDateTime, listMemos } from "../memo-store";

let baseDir: string;

beforeEach(() => {
  baseDir = mkdtempSync(join(tmpdir(), "studio-memo-"));
});

afterEach(() => {
  rmSync(baseDir, { recursive: true, force: true });
});

const writeMemoFixture = (dirName: string, content: string, images: string[] = []): void => {
  const dir = join(baseDir, dirName);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.md"), content, "utf-8");
  for (const image of images) {
    writeFileSync(join(dir, image), Buffer.from([0xff]));
  }
};

describe("countMemoChars", () => {
  it("counts plain text length", () => {
    expect(countMemoChars("こんにちは")).toBe(5);
  });

  it("excludes markdown syntax, matching remark-word-limit", () => {
    expect(countMemoChars("[abc](https://example.com)")).toBe(3);
    expect(countMemoChars("**bold** and _em_")).toBe(11);
  });
});

describe("createMemo", () => {
  it("creates a directory with frontmatter and body", () => {
    const memo = createMemo(baseDir, {
      body: "Hello, world.",
      createdAt: "2026-07-04 12:34:56",
    });

    expect(memo.dirName).toBe("20260704_123456");
    expect(memo.id).toMatch(/^[0-9a-hjkmnp-tv-z]{26}$/u);

    const content = readFileSync(join(baseDir, "20260704_123456", "index.md"), "utf-8");
    expect(content).toBe(
      `---\nid: ${memo.id}\ncreatedAt: 2026-07-04 12:34:56\n---\n\nHello, world.\n`,
    );
  });

  it("writes optional frontmatter fields in schema order", () => {
    const parent = "01kw9kgfn8zsvt3dftz9kemfv9";
    const memo = createMemo(baseDir, {
      body: "Reply body",
      createdAt: "2026-07-04 12:00:00",
      tag: "boxing",
      comment: parent,
      isDraft: true,
      hideLinkCard: true,
    });

    const content = readFileSync(join(baseDir, memo.dirName, "index.md"), "utf-8");
    expect(content).toBe(
      `---\nid: ${memo.id}\ncreatedAt: 2026-07-04 12:00:00\ntag: boxing\ncomment: ${parent}\nisDraft: true\nhideLinkCard: true\n---\n\nReply body\n`,
    );
  });

  it("writes images as zero-padded numbered files", () => {
    const memo = createMemo(baseDir, {
      body: "With images",
      createdAt: "2026-07-04 12:00:00",
      images: [
        { data: new Uint8Array([1]), ext: "jpg" },
        { data: new Uint8Array([2]), ext: "png" },
      ],
    });

    expect(memo.images).toEqual(["01.jpg", "02.png"]);
    const files = readdirSync(join(baseDir, memo.dirName)).toSorted();
    expect(files).toEqual(["01.jpg", "02.png", "index.md"]);
  });

  it("defaults createdAt to now", () => {
    const before = formatDateTime(new Date());
    const memo = createMemo(baseDir, { body: "Now" });

    expect(memo.createdAt >= before).toBe(true);
    expect(memo.createdAt).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/u);
    expect(existsSync(join(baseDir, memo.dirName, "index.md"))).toBe(true);
  });

  it("derives the ULID from the createdAt timestamp", () => {
    const memo = createMemo(baseDir, {
      body: "Timestamped",
      createdAt: "2026-06-24 20:35:56",
    });

    // The 10-char ULID prefix encodes the createdAt instant, so it matches a
    // ULID generated from the same local time. Both sides use the local Date
    // constructor, keeping the assertion timezone-independent (createMemo
    // parses createdAt as local wall-clock time).
    const expectedPrefix = ulid(new Date(2026, 5, 24, 20, 35, 56).getTime())
      .slice(0, 10)
      .toLowerCase();
    expect(memo.id.slice(0, 10)).toBe(expectedPrefix);
  });

  it("rejects an empty body", () => {
    expect(() => createMemo(baseDir, { body: "   " })).toThrow("Body is required");
  });

  it("rejects a body over 500 rendered characters", () => {
    expect(() => createMemo(baseDir, { body: "a".repeat(501) })).toThrow(
      "Character count exceeds the limit: 501",
    );
  });

  it("allows markdown syntax overhead beyond 500 raw characters", () => {
    const body = `[${"a".repeat(500)}](https://example.com)`;
    expect(() => createMemo(baseDir, { body, createdAt: "2026-07-04 12:00:00" })).not.toThrow();
  });

  it("rejects an invalid tag", () => {
    expect(() => createMemo(baseDir, { body: "x", tag: "Boxing" })).toThrow("Invalid tag");
  });

  it("rejects invalid comment and quote targets", () => {
    expect(() => createMemo(baseDir, { body: "x", comment: "not-a-ulid" })).toThrow(
      "Invalid comment target",
    );
    expect(() => createMemo(baseDir, { body: "x", quote: "not-a-ulid" })).toThrow(
      "Invalid quote target",
    );
  });

  it("rejects more than 4 images", () => {
    const images = Array.from({ length: 5 }, () => ({
      data: new Uint8Array([1]),
      ext: "jpg" as const,
    }));
    expect(() => createMemo(baseDir, { body: "x", images })).toThrow("Too many images");
  });

  it("rejects an invalid datetime", () => {
    expect(() => createMemo(baseDir, { body: "x", createdAt: "2026-13-01 00:00:00" })).toThrow(
      "Invalid datetime",
    );
    expect(() => createMemo(baseDir, { body: "x", createdAt: "2026/07/04" })).toThrow(
      "Invalid datetime format",
    );
  });

  it("rejects a duplicate directory", () => {
    createMemo(baseDir, { body: "first", createdAt: "2026-07-04 12:00:00" });
    expect(() => createMemo(baseDir, { body: "second", createdAt: "2026-07-04 12:00:00" })).toThrow(
      "already exists",
    );
  });
});

describe("listMemos", () => {
  it("returns an empty list for a missing directory", () => {
    expect(listMemos(join(baseDir, "nope"))).toEqual([]);
  });

  it("parses frontmatter, collects images, and sorts newest first", () => {
    writeMemoFixture(
      "20260101_000000",
      "---\nid: 01aaaaaaaaaaaaaaaaaaaaaaaa\ncreatedAt: 2026-01-01 00:00:00\ntag: idea\n---\n\nOld memo\n",
    );
    writeMemoFixture(
      "20260201_000000",
      "---\nid: 01bbbbbbbbbbbbbbbbbbbbbbbb\ncreatedAt: 2026-02-01 00:00:00\nisDraft: true\n---\n\nNew memo\n",
      ["02.png", "01.jpg"],
    );

    const memos = listMemos(baseDir);

    expect(memos.map((memo) => memo.id)).toEqual([
      "01bbbbbbbbbbbbbbbbbbbbbbbb",
      "01aaaaaaaaaaaaaaaaaaaaaaaa",
    ]);
    expect(memos[0]).toMatchObject({
      dirName: "20260201_000000",
      body: "New memo",
      isDraft: true,
      images: ["01.jpg", "02.png"],
    });
    expect(memos[1]).toMatchObject({ tag: "idea", isDraft: false, images: [] });
  });

  it("skips directories without a parseable index.md", () => {
    mkdirSync(join(baseDir, "empty-dir"));
    writeMemoFixture("20260101_000000", "no frontmatter here");

    expect(listMemos(baseDir)).toEqual([]);
  });

  it("round-trips a memo written by createMemo", () => {
    const created = createMemo(baseDir, {
      body: "Round trip",
      createdAt: "2026-07-04 12:00:00",
      tag: "test_tag",
      quote: "01kw9kgfn8zsvt3dftz9kemfv9",
      images: [{ data: new Uint8Array([1]), ext: "jpg" }],
    });

    const [memo] = listMemos(baseDir);
    expect(memo).toEqual(created);
  });
});
