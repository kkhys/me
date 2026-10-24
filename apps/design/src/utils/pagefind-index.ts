/* The doc pages are the `.html` files at the root of dist; /preview/* lives
   in a subdirectory and carries no `data-pagefind-body`. */
export const isDocPage = (name: string): boolean => name.endsWith(".html");
