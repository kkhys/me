import type { AskDay, AskMonth } from "#/features/ask/types";
import { anchorGroups, type AskRun } from "#/features/ask/utils/digest";
import { highlightAnchors } from "#/utils/highlights";

/* "AI/LLM" → "AI": the categories are free text from the daily skill (559
   distinct values, 244 once cut at the slash), so only the leading part is
   stable enough to count across days. */
export const topCategory = (category: string): string => category.split("/")[0]?.trim() ?? "";

/* One day as the wider scopes see it: the hero, the highlights with the
   score of their row, and the counts a trend question is answered from. */
export const buildAskDay = (run: AskRun): AskDay => {
  const categories: Record<string, number> = {};
  const scores = new Map<string, number>();
  let total = 0;

  for (const market of run.markets) {
    for (const service of market.services) {
      for (const item of service.items) {
        total += 1;
        const category = topCategory(item.category);
        if (category) categories[category] = (categories[category] ?? 0) + 1;
        // The same story can sit in several services; keep its best showing.
        scores.set(item.url, Math.max(scores.get(item.url) ?? 0, item.score));
      }
    }
  }
  for (const product of run.updates) total += product.items.length;

  const anchors = highlightAnchors(anchorGroups(run), run.digest.highlights);

  return {
    date: run.date,
    headline: run.digest.headline,
    lead: run.digest.lead,
    highlights: run.digest.highlights.map((highlight) => ({
      title: highlight.title_ja || highlight.title,
      source: highlight.service_label,
      anchor: anchors.get(highlight.url) ?? "",
      score: scores.get(highlight.url) ?? 0,
    })),
    total,
    categories,
  };
};

export const buildAskMonth = (month: string, runs: readonly AskRun[]): AskMonth => ({
  month,
  days: runs
    .filter((run) => run.date.startsWith(month))
    .toSorted((a, b) => a.date.localeCompare(b.date))
    .map((run) => buildAskDay(run)),
});
