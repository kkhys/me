/**
 * Filesystem-backed store for memo-content.
 *
 * Reads and writes memo directories (`<base>/YYYYMMDD_HHMMSS/index.md` plus
 * numbered images) following the same conventions as the memo app's content
 * loader. Kept free of Bun-specific APIs so it can be unit-tested on Node.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ulid } from "ulid";
import { countMemoChars, MAX_BODY_LENGTH, MAX_IMAGES, type MemoSummary } from "./memo-format";

/** Invalid input from the client, as opposed to an unexpected server failure. */
export class MemoValidationError extends Error {}

const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/u;
const TAG_PATTERN = /^[a-z0-9_]+$/u;
const ULID_PATTERN = /^[0-9a-hjkmnp-tv-z]{26}$/u;
const IMAGE_FILE_PATTERN = /\.(jpg|png)$/u;

export type MemoImageExt = "jpg" | "png";

export interface MemoImageInput {
  data: Uint8Array;
  ext: MemoImageExt;
  /** Read in place of the photo; the memo app renders it as the img alt. */
  alt: string;
}

export interface CreateMemoInput {
  body: string;
  createdAt?: string | undefined;
  tag?: string | undefined;
  comment?: string | undefined;
  quote?: string | undefined;
  isDraft?: boolean | undefined;
  hideLinkCard?: boolean | undefined;
  images?: MemoImageInput[] | undefined;
}

export type { MemoSummary };

const pad = (n: number) => String(n).padStart(2, "0");

export const formatDateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** Parse a `YYYY-MM-DD HH:mm:ss` string, rejecting impossible dates. */
const parseDateTime = (dateTimeStr: string): Date => {
  const match = dateTimeStr.match(DATE_TIME_PATTERN);
  if (!match) {
    throw new MemoValidationError(
      `Invalid datetime format (expected YYYY-MM-DD HH:mm:ss): ${dateTimeStr}`,
    );
  }

  const [, year, month, day, hour, minute, second] = match.map(Number) as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  const date = new Date(year, month - 1, day, hour, minute, second);

  if (formatDateTime(date) !== dateTimeStr) {
    throw new MemoValidationError(`Invalid datetime: ${dateTimeStr}`);
  }

  return date;
};

const dirNameFromDateTime = (dateTimeStr: string): string =>
  dateTimeStr.replaceAll("-", "").replaceAll(":", "").replace(" ", "_");

interface ParsedMemoFile {
  frontmatter: Map<string, string>;
  body: string;
}

const parseMemoFile = (content: string): ParsedMemoFile | undefined => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/u);
  if (!match) return undefined;

  const frontmatter = new Map<string, string>();
  for (const line of (match[1] as string).split("\n")) {
    // Only top-level scalars matter here; nested blocks (`images:`) are
    // read by the memo app's loader, not by the studio feed.
    if (line.startsWith(" ") || line.startsWith("-")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    frontmatter.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }

  return { frontmatter, body: (match[2] as string).trim() };
};

interface ImageFrontmatter {
  file: string;
  alt: string;
}

// A JSON string literal is a valid YAML double-quoted scalar, so this keeps
// quotes, colons and hashes in the alt from breaking the frontmatter.
const yamlString = (value: string): string => JSON.stringify(value);

const serializeMemoFile = (
  frontmatter: { id: string; createdAt: string; images: ImageFrontmatter[] } & Omit<
    CreateMemoInput,
    "body" | "images"
  >,
  body: string,
): string => {
  const lines = [`id: ${frontmatter.id}`, `createdAt: ${frontmatter.createdAt}`];
  if (frontmatter.tag) lines.push(`tag: ${frontmatter.tag}`);
  if (frontmatter.comment) lines.push(`comment: ${frontmatter.comment}`);
  if (frontmatter.quote) lines.push(`quote: ${frontmatter.quote}`);
  if (frontmatter.isDraft) lines.push("isDraft: true");
  if (frontmatter.hideLinkCard) lines.push("hideLinkCard: true");
  if (frontmatter.images.length > 0) {
    lines.push("images:");
    for (const image of frontmatter.images) {
      lines.push(`  - file: ${image.file}`, `    alt: ${yamlString(image.alt)}`);
    }
  }

  return `---\n${lines.join("\n")}\n---\n\n${body.trim()}\n`;
};

const validateInput = (input: CreateMemoInput): void => {
  if (input.body.trim() === "") {
    throw new MemoValidationError("Body is required");
  }

  const charCount = countMemoChars(input.body);
  if (charCount > MAX_BODY_LENGTH) {
    throw new MemoValidationError(
      `Character count exceeds the limit: ${charCount} characters (limit: ${MAX_BODY_LENGTH} characters)`,
    );
  }

  if (input.tag !== undefined && !TAG_PATTERN.test(input.tag)) {
    throw new MemoValidationError(`Invalid tag (allowed: a-z, 0-9, _): ${input.tag}`);
  }

  for (const [field, value] of [
    ["comment", input.comment],
    ["quote", input.quote],
  ] as const) {
    if (value !== undefined && !ULID_PATTERN.test(value)) {
      throw new MemoValidationError(
        `Invalid ${field} target (expected a lowercase ULID): ${value}`,
      );
    }
  }

  if (input.images !== undefined && input.images.length > MAX_IMAGES) {
    throw new MemoValidationError(`Too many images: ${input.images.length} (limit: ${MAX_IMAGES})`);
  }

  input.images?.forEach((image, index) => {
    if (image.alt.trim() === "") {
      throw new MemoValidationError(`Alt text is required for image ${index + 1}`);
    }
  });
};

/**
 * Create a memo directory with index.md and numbered image files.
 *
 * @returns Summary of the created memo
 */
export const createMemo = (baseDir: string, input: CreateMemoInput): MemoSummary => {
  validateInput(input);

  const createdAt = input.createdAt ?? formatDateTime(new Date());
  const timestamp = parseDateTime(createdAt).getTime();
  const id = ulid(timestamp).toLowerCase();
  const dirName = dirNameFromDateTime(createdAt);
  const memoDir = join(baseDir, dirName);

  if (existsSync(memoDir)) {
    throw new MemoValidationError(`Memo directory already exists: ${dirName}`);
  }

  const body = input.body.trim();
  const images = input.images ?? [];
  const imageNames = images.map(
    (image, index) => `${String(index + 1).padStart(2, "0")}.${image.ext}`,
  );

  mkdirSync(memoDir, { recursive: true });
  writeFileSync(
    join(memoDir, "index.md"),
    serializeMemoFile(
      {
        id,
        createdAt,
        tag: input.tag,
        comment: input.comment,
        quote: input.quote,
        isDraft: input.isDraft,
        hideLinkCard: input.hideLinkCard,
        images: images.map((image, index) => ({
          file: imageNames[index] as string,
          alt: image.alt.trim(),
        })),
      },
      body,
    ),
    "utf-8",
  );

  images.forEach((image, index) => {
    writeFileSync(join(memoDir, imageNames[index] as string), image.data);
  });

  return {
    dirName,
    id,
    createdAt,
    body,
    tag: input.tag,
    comment: input.comment,
    quote: input.quote,
    isDraft: input.isDraft ?? false,
    images: imageNames,
  };
};

/** List all memos under baseDir, newest first. */
export const listMemos = (baseDir: string): MemoSummary[] => {
  if (!existsSync(baseDir)) return [];

  const memos: MemoSummary[] = [];

  for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const indexPath = join(baseDir, entry.name, "index.md");
    if (!existsSync(indexPath)) continue;

    const parsed = parseMemoFile(readFileSync(indexPath, "utf-8"));
    const id = parsed?.frontmatter.get("id");
    const createdAt = parsed?.frontmatter.get("createdAt");
    if (!parsed || !id || !createdAt) continue;

    const images = readdirSync(join(baseDir, entry.name))
      .filter((file) => IMAGE_FILE_PATTERN.test(file))
      .toSorted((a, b) => a.localeCompare(b));

    memos.push({
      dirName: entry.name,
      id,
      createdAt,
      body: parsed.body,
      tag: parsed.frontmatter.get("tag"),
      comment: parsed.frontmatter.get("comment"),
      quote: parsed.frontmatter.get("quote"),
      isDraft: parsed.frontmatter.get("isDraft") === "true",
      images,
    });
  }

  return memos.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
};
