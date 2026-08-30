export interface PagefindEntry {
  languages: Record<string, { page_count: number }>;
}

export const countIndexedPages = (entry: PagefindEntry): number =>
  Object.values(entry.languages).reduce((sum, language) => sum + language.page_count, 0);

/* The doc pages are the `.html` files at the root of dist; /preview/* lives
   in a subdirectory and carries no `data-pagefind-body`. */
export const isDocPage = (name: string): boolean => name.endsWith(".html");

// Every root page carries `data-pagefind-body` on <main> and nothing else does,
// so the index must cover exactly that many pages. Fewer means a page lost the
// attribute; more means it vanished everywhere and Pagefind fell back to
// indexing every document, previews included.
export const assertIndexCoversPages = ({
  indexed,
  pages,
}: {
  indexed: number;
  pages: number;
}): void => {
  if (pages === 0) throw new Error("Pagefind index check: no doc pages were built");
  if (indexed !== pages) {
    throw new Error(`Pagefind index check: ${indexed} pages indexed, ${pages} doc pages built`);
  }
};
