import type { AskDay, AskDayHighlight } from "#/features/ask/types";
import { jaDate, monthOf } from "#/features/ask/utils/scope";

/* The numbers behind a question over several days. The model cannot count
   across 30 days of rows, so the counting happens here and it gets the
   result as a short table to put into words. */

export interface DatedHighlight extends AskDayHighlight {
  date: string;
}

/**
 * The highest-scored highlights of the days, best first (newer first on a
 * tie). Scores are percentiles within a source, so this is the closest the
 * data comes to "the most discussed"; release notes carry none and are left out.
 */
export const topHighlights = (days: readonly AskDay[], limit: number): DatedHighlight[] =>
  days
    .flatMap((day) => day.highlights.map((highlight) => ({ ...highlight, date: day.date })))
    .filter((highlight) => highlight.score > 0)
    .toSorted((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, limit);

export const categoryCounts = (days: readonly AskDay[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const day of days) {
    for (const [category, count] of Object.entries(day.categories)) {
      counts.set(category, (counts.get(category) ?? 0) + count);
    }
  }
  return counts;
};

const rankCategories = (counts: Map<string, number>, limit: number): [string, number][] =>
  [...counts].toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja")).slice(0, limit);

const rowTotal = (days: readonly AskDay[]): number => days.reduce((n, day) => n + day.total, 0);

const signed = (delta: number): string => (delta > 0 ? `+${delta}` : String(delta));

/**
 * Rows per category over `current`, the `limit` largest, each with the
 * count of `previous` (the same number of days before) beside it when given.
 */
export const formatCategoryTable = (
  current: readonly AskDay[],
  previous: readonly AskDay[] | undefined,
  limit: number,
): string => {
  const counts = categoryCounts(current);
  const before = previous === undefined ? undefined : categoryCounts(previous);
  const lines = rankCategories(counts, limit).map(([category, count]) => {
    if (before === undefined) return `${category}: ${count} 件`;
    const was = before.get(category) ?? 0;
    return `${category}: ${count} 件（前の期間 ${was} 件、${signed(count - was)}）`;
  });
  const header =
    before === undefined
      ? `記事数: ${rowTotal(current)} 件（${current.length} 日分）。カテゴリ別の件数:`
      : `記事数: ${rowTotal(current)} 件（${current.length} 日分）、前の期間は ${rowTotal(previous ?? [])} 件（${previous?.length ?? 0} 日分）。カテゴリ別の件数:`;
  return [header, ...lines].join("\n");
};

/** Rows and the `limit` largest categories of each month the days fall in, ascending. */
export const formatMonthlyTable = (days: readonly AskDay[], limit: number): string => {
  const months = new Map<string, AskDay[]>();
  for (const day of days) {
    const month = monthOf(day.date);
    months.set(month, [...(months.get(month) ?? []), day]);
  }
  const lines = [...months].map(([month, inMonth]) => {
    const top = rankCategories(categoryCounts(inMonth), limit)
      .map(([category, count]) => `${category} ${count}`)
      .join("、");
    return `${month}: ${inMonth.length} 日、${rowTotal(inMonth)} 件。上位カテゴリ: ${top}`;
  });
  return ["月ごとの記事数と上位カテゴリ:", ...lines].join("\n");
};

/** "10月18日 Title（Hacker News）" */
export const formatHighlight = (highlight: DatedHighlight): string =>
  `${jaDate(highlight.date)} ${highlight.title}（${highlight.source}）`;
