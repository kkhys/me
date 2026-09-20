import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Metadata } from "@kkhys/ui/link-metadata";

/**
 * Link-card metadata resolved on a developer's machine and committed next to
 * the memos.
 *
 * The deploy runs unattended from CI, where a host that blocks its IPs or
 * answers slowly leaves a card carrying nothing but the hostname — and that
 * result is then baked into a static page. The build reads whatever was
 * resolved here before falling back to its own fetch.
 */
export const LINK_METADATA_PATH = fileURLToPath(
  new URL("../../memo-content/data/link-metadata.json", import.meta.url),
);

/** JSON shape: absent keys instead of nulls, so the file stays small. */
interface StoredEntry {
  title: string;
  description?: string;
  icon?: string;
  /** og:image URL, already verified as one sharp can decode. */
  image?: string;
}

const text = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const toMetadata = (value: unknown): Metadata | undefined => {
  if (typeof value !== "object" || value === null) return undefined;

  const entry = value as Record<string, unknown>;
  const title = text(entry.title);
  // A titleless entry is the blank card this cache exists to prevent; let the
  // build retry over the network instead of pinning the empty result.
  if (!title) return undefined;

  const src = text(entry.image);
  return {
    title,
    description: text(entry.description),
    icon: text(entry.icon),
    image: src ? { src, width: undefined, height: undefined, alt: undefined } : undefined,
  };
};

const toStored = (metadata: Metadata): StoredEntry | undefined => {
  const title = text(metadata.title);
  if (!title) return undefined;

  const description = text(metadata.description);
  const icon = text(metadata.icon);
  const image = text(metadata.image?.src);
  return {
    title,
    ...(description && { description }),
    ...(icon && { icon }),
    ...(image && { image }),
  };
};

/**
 * Missing file, unreadable JSON and malformed entries all degrade to "nothing
 * cached": fixture builds skip the submodule entirely, and a half-written file
 * must not take the deploy down.
 */
export const readLinkMetadata = (path: string = LINK_METADATA_PATH): Record<string, Metadata> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
  if (typeof parsed !== "object" || parsed === null) return {};

  const entries: Record<string, Metadata> = {};
  for (const [url, value] of Object.entries(parsed)) {
    const metadata = toMetadata(value);
    if (metadata) entries[url] = metadata;
  }
  return entries;
};

/** Sorted by URL so re-running the refresh produces a reviewable diff. */
export const writeLinkMetadata = (
  entries: Readonly<Record<string, Metadata>>,
  path: string = LINK_METADATA_PATH,
): void => {
  const stored: Record<string, StoredEntry> = {};
  for (const url of Object.keys(entries).toSorted()) {
    const entry = toStored(entries[url]!);
    if (entry) stored[url] = entry;
  }
  writeFileSync(path, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
};
