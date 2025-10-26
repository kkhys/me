import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { createIndex, type PagefindServiceConfig } from "pagefind";

interface PagefindOptions {
  indexConfig?: PagefindServiceConfig;
}

const pagefind = ({ indexConfig }: PagefindOptions = {}): AstroIntegration => {
  return {
    name: "pagefind",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const { index, errors: createErrors } = await createIndex(indexConfig);

        if (!index) {
          logger.error("Pagefind failed to create index");
          for (const e of createErrors) {
            logger.error(e);
          }
          return;
        }

        const { page_count, errors: addErrors } = await index.addDirectory({
          path: outDir,
        });

        if (addErrors.length) {
          logger.error("Pagefind failed to index files");
          for (const e of addErrors) {
            logger.error(e);
          }
          return;
        }

        logger.info(`Pagefind indexed ${page_count} pages`);

        const { outputPath, errors: writeErrors } = await index.writeFiles({
          outputPath: path.join(outDir, "pagefind"),
        });

        if (writeErrors.length) {
          logger.error("Pagefind failed to write index");
          for (const e of writeErrors) {
            logger.error(e);
          }
          return;
        }

        logger.info(`Pagefind wrote index to ${outputPath}`);
      },
    },
  };
};

export default pagefind;
