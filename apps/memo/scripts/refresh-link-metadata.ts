/**
 * Resolves the link-card metadata for every memo and writes it to
 * `memo-content/data/link-metadata.json`.
 *
 * Run from a developer's machine: the deploy runs unattended from CI, where a
 * host that blocks its IPs or answers slowly leaves a card with nothing but the
 * hostname, so the build reads this file instead of refetching. Already-cached
 * URLs are left alone unless `--force` is passed, and URLs no longer referenced
 * by any memo drop out.
 *
 * Usage: `pnpm --filter @kkhys/memo link-metadata [--force]`
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { createMetadataFetcher, type Metadata } from "@kkhys/ui/link-metadata";
import {
  LINK_METADATA_PATH,
  readLinkMetadata,
  writeLinkMetadata,
} from "../src/lib/link-metadata-cache";
import remarkEscapeSyntax from "../src/lib/remark-escape-syntax";
import remarkExtractLink from "../src/lib/remark-extract-link";

const MEMO_DIR = fileURLToPath(new URL("../memo-content/memo", import.meta.url));

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u;
const HIDE_LINK_CARD = /^hideLinkCard:\s*true\s*$/mu;

// Same plugins the build runs ahead of link extraction, so a memo whose body
// only gets its link once the escaping pass is done resolves identically here.
const processor = await createMarkdownProcessor({
  remarkPlugins: [remarkEscapeSyntax, remarkExtractLink],
});

const firstExternalLink = async (body: string): Promise<string | undefined> => {
  const { metadata } = await processor.render(body);
  const link = metadata.frontmatter.firstExternalLink;
  return typeof link === "string" ? link : undefined;
};

const memoLinks = async (): Promise<Set<string>> => {
  const links = new Set<string>();

  for (const entry of readdirSync(MEMO_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    let source: string;
    try {
      source = readFileSync(join(MEMO_DIR, entry.name, "index.md"), "utf8");
    } catch {
      continue;
    }

    const match = FRONTMATTER.exec(source);
    if (match && HIDE_LINK_CARD.test(match[1] ?? "")) continue;

    const link = await firstExternalLink(match ? source.slice(match[0].length) : source);
    if (link) links.add(link);
  }

  return links;
};

// A failed fetch has to be distinguishable from a real result, and the shared
// fetcher signals failure by returning whatever `notFound` is: an entry with no
// title is dropped rather than committed.
const fetchMetadata = createMetadataFetcher({
  enabled: true,
  notFound: { title: undefined, description: undefined, image: undefined, icon: undefined },
});

const force = process.argv.includes("--force");
const cached = force ? {} : readLinkMetadata();

const resolved: Record<string, Metadata> = {};
const unresolved: string[] = [];
let added = 0;

for (const url of [...(await memoLinks())].toSorted()) {
  const hit = cached[url];
  if (hit) {
    resolved[url] = hit;
    continue;
  }

  const metadata = await fetchMetadata(url);
  if (metadata.title) {
    resolved[url] = metadata;
    added += 1;
  } else {
    unresolved.push(url);
  }
}

writeLinkMetadata(resolved, LINK_METADATA_PATH);

console.log(`${Object.keys(resolved).length} entries written (${added} new)`);
if (unresolved.length > 0) {
  console.warn(`could not resolve:\n${unresolved.map((url) => `  ${url}`).join("\n")}`);
}
