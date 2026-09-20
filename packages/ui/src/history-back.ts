/* The behaviour behind site-header.astro's `historyBackLabel`. The back
   button is a plain link home, and following it always lands on the top of
   the first page. When the visitor came from a page of this site, step back
   through history instead: the browser then restores that page from its
   bfcache, appended infinite-scroll pages and scroll position included. */

/** The slice of `window` this reads, so tests can pass a plain object. */
export interface HistoryBackWindow {
  document: { referrer: string };
  location: { origin: string };
  history: { length: number; back: () => void };
}

/**
 * A same-origin referrer says the previous history entry is ours. The length
 * check rules out a link opened in a new tab, which keeps the referrer but
 * starts a history with nothing behind it.
 */
export const cameFromThisSite = (win: HistoryBackWindow): boolean =>
  win.history.length > 1 && win.document.referrer.startsWith(`${win.location.origin}/`);

/**
 * Upgrades a back link carrying `data-history-back-label`: swaps in that
 * accessible name and turns plain clicks into `history.back()`. Without the
 * attribute, or for a visitor who did not come from this site, the link stays
 * the home link it was rendered as.
 */
export const initHistoryBack = (
  link: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>(
    "a[data-history-back-label]",
  ),
  win: HistoryBackWindow = window,
): void => {
  const label = link?.dataset["historyBackLabel"];
  if (!link || !label || !cameFromThisSite(win)) return;

  link.setAttribute("aria-label", label);
  link.addEventListener("click", (event) => {
    // A modified click opens the home link in a new tab or window.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    win.history.back();
  });
};
