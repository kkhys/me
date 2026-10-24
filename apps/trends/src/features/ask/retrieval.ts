import type {
  PagefindModule,
  PagefindSearchFragment,
  PagefindSearchOptions,
  PagefindSearchResult,
} from "@kkhys/search/types";
import { askConfig } from "#/features/ask/config";
import type { AskDigest, AskItem, AskMonth, AskScope } from "#/features/ask/types";
import {
  type Block,
  dayBlock,
  heroBlocks,
  highlightBlock,
  rowBlock,
  tableBlock,
} from "#/features/ask/utils/context";
import { formatCategoryTable, formatMonthlyTable, topHighlights } from "#/features/ask/utils/days";
import { classifyQuestion } from "#/features/ask/utils/question";
import { rankItems } from "#/features/ask/utils/rank";
import {
  type DateRange,
  daysBetween,
  describeRange,
  inRange,
  monthsOf,
  previousRange,
  scopeRange,
} from "#/features/ask/utils/scope";
import { searchConfig } from "#/features/search/config";
import { isItemSection } from "#/features/search/utils/section";

/* Gathers what the model is shown for a question, by scope:
   - この日: the rows `rankItems` picks from the day's JSON, else the hero.
   - 7 / 30 日間, 全期間 with a topic: Pagefind finds the days, their JSON
     supplies the rows the matched sections point at, `rankItems` orders them.
   - 7 / 30 日間 without a topic: the days' heroes from the month JSON, with
     the top-scored highlights, plus a category table for a trend question.
   - 全期間 without a topic: a month-by-month table and the top highlights.
   Everything is fetched on demand and cached for the page's lifetime. */

export interface RetrieverDeps {
  /** The open page and the first run. */
  date: string;
  firstDate: string;
  fetchJson: <T>(url: string) => Promise<T>;
  loadPagefind: () => Promise<PagefindModule>;
}

export interface Material {
  /** `describeRange` of the scope, for the 期間 line. */
  period: string;
  blocks: Block[];
}

export interface Retriever {
  retrieve(question: string, scope: AskScope): Promise<Material>;
  /** Starts the fetches a scope will need; failures surface on the question instead. */
  warm(scope: AskScope): void;
}

interface DatedItem extends AskItem {
  date: string;
}

const withDate = (item: AskItem, date: string): DatedItem => ({ ...item, date });

interface SearchHit {
  date: string;
  /** Anchors of the item rows Pagefind matched on that day. */
  anchors: Set<string>;
}

/* A fetch that forgets its failure, so the next question retries instead of
   replaying a network error for the rest of the page's life. */
const memo = <T>(load: (key: string) => Promise<T>) => {
  const cache = new Map<string, Promise<T>>();
  return (key: string): Promise<T> => {
    let promise = cache.get(key);
    if (promise === undefined) {
      promise = load(key).catch((error: unknown) => {
        cache.delete(key);
        throw error;
      });
      cache.set(key, promise);
    }
    return promise;
  };
};

export const createRetriever = (deps: RetrieverDeps): Retriever => {
  const loadDay = memo((date) => deps.fetchJson<AskDigest>(askConfig.endpoint(date)));
  const loadMonth = memo((month) => deps.fetchJson<AskMonth>(askConfig.monthEndpoint(month)));

  const loadDays = async (range: DateRange) => {
    const months = await Promise.all(monthsOf(range).map((month) => loadMonth(month)));
    return months.flatMap((month) => month.days).filter((day) => inRange(day.date, range));
  };

  const rowHref = (date: string, anchor: string) =>
    date === deps.date ? `#${anchor}` : `/${date}#${anchor}`;

  const rowBlocks = (rows: readonly DatedItem[]): Block[] =>
    rows.map((row, rank) =>
      rowBlock(row, row.date, rank, {
        detailed: rank < askConfig.detailedReferences,
        maxDetailChars: askConfig.maxDetailChars,
        href: rowHref(row.date, row.anchor),
        dated: row.date !== deps.date,
      }),
    );

  /* One Pagefind search per term, merged by page: a question's words rarely
     all sit on one page, and Pagefind itself drops the pages that miss one.
     Rare words score far higher than common ones, so the sum already weights
     the topic over the phrasing around it. */
  const searchDays = async (terms: readonly string[], range: DateRange): Promise<SearchHit[]> => {
    const pagefind = await deps.loadPagefind();
    // The months first, the exact dates after: an old page's 全期間 would
    // otherwise spend its `searchResults` on days after it.
    const options: PagefindSearchOptions = {
      filters: { [searchConfig.filterKeys.month]: { any: monthsOf(range) } },
    };
    const responses = await Promise.all(terms.map((term) => pagefind.search(term, options)));

    const pages = new Map<string, { score: number; results: PagefindSearchResult[] }>();
    for (const response of responses) {
      for (const result of response.results) {
        const page = pages.get(result.id) ?? { score: 0, results: [] };
        page.score += result.score;
        page.results.push(result);
        pages.set(result.id, page);
      }
    }
    const top = [...pages.values()]
      .toSorted((a, b) => b.score - a.score)
      .slice(0, askConfig.searchResults);

    // Every term's fragment of a page: each carries the sections that term
    // matched, and the date meta is the same on all of them.
    const hits = await Promise.all(
      top.map(async (page) => {
        const fragments: PagefindSearchFragment[] = await Promise.all(
          page.results.map((result) => result.data()),
        );
        const anchors = new Set<string>();
        let date: string | undefined;
        for (const fragment of fragments) {
          date ??= fragment.meta[searchConfig.metaKeys.date];
          for (const section of fragment.sub_results) {
            if (isItemSection(section) && section.anchor) anchors.add(section.anchor.id);
          }
        }
        return date === undefined ? undefined : { date, anchors };
      }),
    );
    return hits
      .filter((hit): hit is SearchHit => hit !== undefined && inRange(hit.date, range))
      .slice(0, askConfig.searchDays);
  };

  const topicRows = async (
    question: string,
    hits: readonly SearchHit[],
    timeline: boolean,
  ): Promise<DatedItem[]> => {
    const digests = await Promise.all(hits.map((hit) => loadDay(hit.date)));
    const matched: DatedItem[] = [];
    const all: DatedItem[] = [];
    digests.forEach((digest, i) => {
      const anchors = hits[i]?.anchors ?? new Set<string>();
      for (const item of digest.items) {
        const row = withDate(item, digest.date);
        all.push(row);
        if (anchors.has(item.anchor)) matched.push(row);
      }
    });
    // A hit in a day's hero names no row; fall back to the whole day.
    const candidates = matched.length > 0 ? matched : all;
    const ranked = rankItems(question, candidates, askConfig.maxReferences);
    // The ranker tokenises differently from Pagefind and may see nothing in
    // common; Pagefind's own order is then the answer.
    const rows = ranked.length > 0 ? ranked : candidates.slice(0, askConfig.maxReferences);
    // A 時系列 answer reads the rows in order; handing them over by date
    // keeps the model from inventing one.
    return timeline ? rows.toSorted((a, b) => a.date.localeCompare(b.date)) : rows;
  };

  const dayMaterial = async (question: string, range: DateRange): Promise<Material> => {
    const digest = await loadDay(deps.date);
    const rows = rankItems(question, digest.items, askConfig.maxReferences).map((item) =>
      withDate(item, digest.date),
    );
    return {
      period: describeRange(range),
      blocks: rows.length > 0 ? rowBlocks(rows) : heroBlocks(digest),
    };
  };

  const periodMaterial = async (
    question: string,
    scope: AskScope,
    range: DateRange,
  ): Promise<Material> => {
    const period = describeRange(range);
    const intent = classifyQuestion(question);

    if (intent.terms.length > 0) {
      const hits = await searchDays(intent.terms, range);
      const rows = hits.length > 0 ? await topicRows(question, hits, intent.timeline) : [];
      return { period, blocks: rowBlocks(rows) };
    }

    const trend = intent.trend || scope === "all";
    const before = previousRange(range, deps.firstDate);
    // The archive's first weeks have less than a full period before them; a
    // comparison against under half the days would read as a drop.
    const comparable =
      before !== undefined &&
      daysBetween(before.start, before.end) * 2 >= daysBetween(range.start, range.end);
    const [days, previous] = await Promise.all([
      loadDays(range),
      trend && scope !== "all" && comparable ? loadDays(before) : Promise.resolve(undefined),
    ]);
    if (days.length === 0) return { period, blocks: [] };

    const blocks: Block[] = [];
    if (trend) {
      const table =
        scope === "all"
          ? formatMonthlyTable(days, askConfig.tableCategories)
          : formatCategoryTable(days, previous, askConfig.tableCategories);
      blocks.push(tableBlock(table, 0, 0));
    }
    // Days pack before highlights for a summary (the leads are the story)
    // and after the table and highlights for a trend (the numbers are).
    const dayPriority = trend ? 200 : 0;
    const highlightPriority = trend ? 1 : 100;
    topHighlights(days, askConfig.topHighlights).forEach((highlight, i) => {
      blocks.push(highlightBlock(highlight, highlightPriority + i, 2000 + i));
    });
    if (scope !== "all") {
      // Newest first in priority: when days must be dropped, the oldest go.
      days.forEach((day, i) => {
        blocks.push(
          dayBlock(day, dayPriority + (days.length - 1 - i), 1000 + i, askConfig.dayHighlights),
        );
      });
    }
    return { period, blocks };
  };

  return {
    retrieve(question, scope) {
      const range = scopeRange(scope, deps.date, deps.firstDate);
      return scope === "day"
        ? dayMaterial(question, range)
        : periodMaterial(question, scope, range);
    },
    warm(scope) {
      if (scope === "day") {
        loadDay(deps.date).catch(() => {});
        return;
      }
      // Only the months, not the previous period's: a trend question is the
      // less common one, and the Pagefind warm-up covers the topic path.
      for (const month of monthsOf(scopeRange(scope, deps.date, deps.firstDate))) {
        loadMonth(month).catch(() => {});
      }
      deps.loadPagefind().catch(() => {});
    },
  };
};
