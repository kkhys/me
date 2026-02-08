import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { glob } from "node:fs/promises";
import { createMermaidRenderer } from "mermaid-isomorphic";
import { rehypeMermaidOptions } from "../src/lib/rehype-mermaid-options";

const CACHE_DIR = ".cache/mermaid";

const getMermaidHash = (source: string): string => {
  return createHash("sha256").update(source).digest("hex").slice(0, 16);
};

const extractMermaidBlocks = (content: string): string[] => {
  const blocks: string[] = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  for (const match of content.matchAll(regex)) {
    if (match[1]) {
      blocks.push(match[1].trim());
    }
  }
  return blocks;
};

const main = async () => {
  mkdirSync(CACHE_DIR, { recursive: true });

  const mdxFiles: string[] = [];
  for await (const file of glob("content/blog/**/index.mdx")) {
    mdxFiles.push(file);
  }

  const allBlocks: { source: string; hash: string }[] = [];

  for (const file of mdxFiles) {
    const content = readFileSync(file, "utf-8");
    const blocks = extractMermaidBlocks(content);
    for (const source of blocks) {
      const hash = getMermaidHash(source);
      allBlocks.push({ source, hash });
    }
  }

  // Deduplicate by hash
  const uniqueBlocks = new Map<string, string>();
  for (const { hash, source } of allBlocks) {
    if (!uniqueBlocks.has(hash)) {
      uniqueBlocks.set(hash, source);
    }
  }

  console.log(
    `Found ${allBlocks.length} mermaid blocks (${uniqueBlocks.size} unique) across ${mdxFiles.length} files`,
  );

  // Remove stale cache files
  if (existsSync(CACHE_DIR)) {
    const cachedFiles = readdirSync(CACHE_DIR);
    for (const file of cachedFiles) {
      const hash = file.replace(/-(light|dark)\.svg$/, "");
      if (!uniqueBlocks.has(hash)) {
        unlinkSync(`${CACHE_DIR}/${file}`);
        console.log(`  Removed stale cache: ${file}`);
      }
    }
  }

  const toRender = [...uniqueBlocks.entries()]
    .filter(([hash]) => {
      const lightPath = `${CACHE_DIR}/${hash}-light.svg`;
      const darkPath = `${CACHE_DIR}/${hash}-dark.svg`;
      return !existsSync(lightPath) || !existsSync(darkPath);
    })
    .map(([hash, source]) => ({ hash, source }));

  if (toRender.length === 0) {
    console.log("All mermaid blocks are already cached. Nothing to render.");
    return;
  }

  console.log(`Rendering ${toRender.length} new mermaid blocks...`);

  const render = createMermaidRenderer();
  const sources = toRender.map(({ source }) => source);

  const lightConfig = {
    theme: (rehypeMermaidOptions.mermaidConfig.theme ?? "base") as "base",
    fontFamily: rehypeMermaidOptions.mermaidConfig.fontFamily ?? "monospace",
    themeVariables: rehypeMermaidOptions.mermaidConfig.themeVariables ?? {},
  };

  const darkConfig = {
    theme: (rehypeMermaidOptions.dark.theme ?? "base") as "base",
    fontFamily: rehypeMermaidOptions.dark.fontFamily ?? "monospace",
    themeVariables: rehypeMermaidOptions.dark.themeVariables ?? {},
  };

  console.log("  Rendering light theme (batch)...");
  const lightResults = await render(sources, { mermaidConfig: lightConfig });

  console.log("  Rendering dark theme (batch)...");
  const darkResults = await render(sources, { mermaidConfig: darkConfig });

  for (let i = 0; i < toRender.length; i++) {
    const block = toRender[i];
    const lightResult = lightResults[i];
    const darkResult = darkResults[i];

    if (!block || !lightResult || !darkResult) continue;

    if (lightResult.status === "rejected" || darkResult.status === "rejected") {
      console.error(`  Failed to render ${block.hash}`);
      if (lightResult.status === "rejected")
        console.error("    Light render failed:", lightResult.reason);
      if (darkResult.status === "rejected")
        console.error("    Dark render failed:", darkResult.reason);
      continue;
    }

    writeFileSync(
      `${CACHE_DIR}/${block.hash}-light.svg`,
      lightResult.value.svg,
    );
    writeFileSync(`${CACHE_DIR}/${block.hash}-dark.svg`, darkResult.value.svg);
    console.log(`  Cached ${block.hash}`);
  }

  console.log("Done!");
};

main().catch((error) => {
  console.error("Failed to render mermaid blocks:", error);
  process.exit(1);
});
