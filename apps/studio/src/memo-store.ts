/**
 * Filesystem-backed store for memo-content.
 *
 * Reads and writes memo directories (`<base>/YYYYMMDD_HHMMSS/index.md` plus
 * numbered images) following the same conventions as the memo app's content
 * loader. Kept free of Bun-specific APIs so it can be unit-tested on Node.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { toString as mdastToString } from "mdast-util-to-string";
import { remark } from "remark";
import { ulid } from "ulid";

export const MAX_BODY_LENGTH = 500;
export const MAX_IMAGES = 4;

const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/u;
const TAG_PATTERN = /^[a-z0-9_]+$/u;
const ULID_PATTERN = /^[0-9a-hjkmnp-tv-z]{26}$/u;
const IMAGE_FILE_PATTERN = /\.(jpg|png)$/u;

export type MemoImageExt = "jpg" | "png";

export interface MemoImageInput {
  data: Uint8Array;
  ext: MemoImageExt;
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

export interface MemoSummary {
  dirName: string;
  id: string;
  createdAt: string;
  body: string;
  tag?: string | undefined;
  comment?: string | undefined;
  quote?: string | undefined;
  isDraft: boolean;
  images: string[];
}

const processor = remark();

/**
 * Count body characters the same way the memo app's remark-word-limit plugin
 * does: markdown syntax is excluded, only rendered text is counted.
 */
export const countMemoChars = (body: string): number => mdastToString(processor.parse(body)).length;

const pad = (n: number) => String(n).padStart(2, "0");

export const formatDateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** Parse a `YYYY-MM-DD HH:mm:ss` string, rejecting impossible dates. */
const parseDateTime = (dateTimeStr: string): Date => {
  const match = dateTimeStr.match(DATE_TIME_PATTERN);
  if (!match) {
    throw new Error(`Invalid datetime format (expected YYYY-MM-DD HH:mm:ss): ${dateTimeStr}`);
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
    throw new Error(`Invalid datetime: ${dateTimeStr}`);
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
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    frontmatter.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }

  return { frontmatter, body: (match[2] as string).trim() };
};

const serializeMemoFile = (
  frontmatter: { id: string; createdAt: string } & Omit<CreateMemoInput, "body" | "images">,
  body: string,
): string => {
  const lines = [`id: ${frontmatter.id}`, `createdAt: ${frontmatter.createdAt}`];
  if (frontmatter.tag) lines.push(`tag: ${frontmatter.tag}`);
  if (frontmatter.comment) lines.push(`comment: ${frontmatter.comment}`);
  if (frontmatter.quote) lines.push(`quote: ${frontmatter.quote}`);
  if (frontmatter.isDraft) lines.push("isDraft: true");
  if (frontmatter.hideLinkCard) lines.push("hideLinkCard: true");

  return `---\n${lines.join("\n")}\n---\n\n${body.trim()}\n`;
};

const validateInput = (input: CreateMemoInput): void => {
  if (input.body.trim() === "") {
    throw new Error("Body is required");
  }

  const charCount = countMemoChars(input.body);
  if (charCount > MAX_BODY_LENGTH) {
    throw new Error(
      `Character count exceeds the limit: ${charCount} characters (limit: ${MAX_BODY_LENGTH} characters)`,
    );
  }

  if (input.tag !== undefined && !TAG_PATTERN.test(input.tag)) {
    throw new Error(`Invalid tag (allowed: a-z, 0-9, _): ${input.tag}`);
  }

  for (const [field, value] of [
    ["comment", input.comment],
    ["quote", input.quote],
  ] as const) {
    if (value !== undefined && !ULID_PATTERN.test(value)) {
      throw new Error(`Invalid ${field} target (expected a lowercase ULID): ${value}`);
    }
  }

  if (input.images !== undefined && input.images.length > MAX_IMAGES) {
    throw new Error(`Too many images: ${input.images.length} (limit: ${MAX_IMAGES})`);
  }
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
    throw new Error(`Memo directory already exists: ${dirName}`);
  }

  const body = input.body.trim();
  const images = input.images ?? [];

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
      },
      body,
    ),
    "utf-8",
  );

  const imageNames = images.map((image, index) => {
    const name = `${String(index + 1).padStart(2, "0")}.${image.ext}`;
    writeFileSync(join(memoDir, name), image.data);
    return name;
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
