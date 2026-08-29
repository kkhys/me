import { fileURLToPath } from "node:url";
import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { resolveContentBase, useFixtureData } from "#/config/content-path";
import { parseCaptionYaml, readCaptionFile } from "#/loaders/caption-file";
import { orderedCaptionSchema } from "#/utils/caption";

const base = resolveContentBase(useFixtureData());

const captionCollection = (rootRelativePath: string) => {
  readCaptionFile(fileURLToPath(new URL(`../${rootRelativePath}`, import.meta.url)));
  return defineCollection({
    loader: file(rootRelativePath, { parser: parseCaptionYaml }),
    schema: orderedCaptionSchema,
  });
};

const works = captionCollection(`${base}/works/works.yaml`);
const fashion = captionCollection(`${base}/fashion/fashion.yaml`);

export const collections = { works, fashion };
