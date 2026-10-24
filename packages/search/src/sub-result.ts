import type { PagefindSearchFragment, PagefindSubResult } from "./types";

const weightOf = (subResult: PagefindSubResult): number =>
  subResult.weighted_locations.reduce((sum, location) => sum + location.weight, 0);

/**
 * The section of a page to show for a hit. Pagefind lists `sub_results` in
 * document order, so pick the heaviest match ourselves; ties keep the earlier
 * section. With `prefer`, the choice is made among the sections it accepts
 * whenever any of them matched (trends prefers an item row over the page's
 * headline), and among all of them otherwise. `undefined` when the fragment
 * carries no sections (an index built without heading ids), in which case the
 * caller falls back to the page.
 */
export const pickSubResult = (
  fragment: PagefindSearchFragment,
  prefer?: (subResult: PagefindSubResult) => boolean,
): PagefindSubResult | undefined => {
  const preferred = prefer === undefined ? [] : fragment.sub_results.filter(prefer);
  const candidates = preferred.length > 0 ? preferred : fragment.sub_results;
  return candidates.reduce<PagefindSubResult | undefined>(
    (best, candidate) =>
      best === undefined || weightOf(candidate) > weightOf(best) ? candidate : best,
    undefined,
  );
};
