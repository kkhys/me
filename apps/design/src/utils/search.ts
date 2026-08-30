import { toResultHref } from "@kkhys/search/query";
import type { PagefindSearchFragment, PagefindSubResult } from "@kkhys/search/types";

export const searchConfig = {
  // Not "search-dialog": the Components page already uses that id on the
  // SearchDialog section heading, and the mount looks the dialog up by id.
  dialogId: "site-search",
  // astro-pagefind writes the bundle to `<outDir>/pagefind` and serves
  // `/pagefind/` from there in dev, so build and dev share this absolute path.
  bundlePath: "/pagefind/",
  maxResults: 10,
  debounceMs: 120,
  // Pagefind counts excerpt length in segmented words and centres the excerpt
  // on the match; with short Japanese segments the default 30 spills past the
  // two-line clamp and hides the <mark>.
  excerptLength: 24,
} as const;

const weightOf = (subResult: PagefindSubResult): number =>
  subResult.weighted_locations.reduce((sum, location) => sum + location.weight, 0);

/**
 * The section of a page to show for a hit. Pagefind lists `sub_results` in
 * document order, so pick the heaviest match ourselves; ties keep the earlier
 * section. `undefined` when the fragment carries no sections (an index built
 * without heading ids), in which case the caller falls back to the page.
 */
export const pickSubResult = (fragment: PagefindSearchFragment): PagefindSubResult | undefined =>
  fragment.sub_results.reduce<PagefindSubResult | undefined>(
    (best, candidate) =>
      best === undefined || weightOf(candidate) > weightOf(best) ? candidate : best,
    undefined,
  );

/** `toResultHref` for a sub-result URL, which may carry a `#heading` fragment. */
export const toSectionHref = (url: string): string => {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return toResultHref(url);
  return `${toResultHref(url.slice(0, hashIndex))}${url.slice(hashIndex)}`;
};
