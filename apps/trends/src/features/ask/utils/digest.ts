import type { AskDigest, AskItem } from "#/features/ask/types";
import { highlightAnchors, itemAnchorId } from "#/utils/highlights";
import { sortMarketsGlobalFirst } from "#/utils/markets";
import { UPDATES_ID, UPDATES_LABEL } from "#/utils/updates";

interface RunItem {
  title: string;
  title_ja: string;
  url: string;
  category: string;
  score: number;
  summary: string;
  discussion_summary: string;
  article_summary: string;
}

interface RunUpdate {
  title: string;
  title_ja: string;
  url: string;
  source: string;
  summary: string;
  article_summary: string;
}

export interface RunSource<T> {
  id: string;
  label: string;
  items: readonly T[];
}

export interface RunMarket {
  id: string;
  label: string;
  services: readonly RunSource<RunItem>[];
}

interface RunHighlight {
  title: string;
  title_ja: string;
  url: string;
  service_label: string;
  reason: string;
}

export interface AskRun {
  date: string;
  digest: { headline: string; lead: string; highlights: readonly RunHighlight[] };
  markets: readonly RunMarket[];
  updates: readonly RunSource<RunUpdate>[];
}

/* The markets in display order plus the updates as one more group, the
   shape `highlightAnchors` resolves highlight URLs against. */
export const anchorGroups = (run: AskRun) => [
  ...sortMarketsGlobalFirst([...run.markets]),
  { id: UPDATES_ID, services: run.updates },
];

/* The rows of a run in the order the page shows them (global, japan, then
   the updates), with the same anchors the rows carry, so the model's
   references can link back to them. */
export const buildAskDigest = (run: AskRun): AskDigest => {
  const markets = sortMarketsGlobalFirst([...run.markets]);
  const items: AskItem[] = [];

  for (const market of markets) {
    for (const service of market.services) {
      service.items.forEach((item, i) => {
        items.push({
          anchor: itemAnchorId(market.id, service.id, i + 1),
          title: item.title_ja || item.title,
          original: item.title_ja ? item.title : "",
          source: service.label,
          group: market.label,
          url: item.url,
          category: item.category,
          summary: item.summary,
          detail: item.discussion_summary || item.article_summary,
        });
      });
    }
  }

  for (const product of run.updates) {
    product.items.forEach((item, i) => {
      items.push({
        anchor: itemAnchorId(UPDATES_ID, product.id, i + 1),
        title: item.title_ja || item.title,
        original: item.title_ja ? item.title : "",
        source: product.label,
        group: UPDATES_LABEL,
        url: item.url,
        category: item.source,
        summary: item.summary,
        detail: item.article_summary,
      });
    });
  }

  const anchors = highlightAnchors(anchorGroups(run), run.digest.highlights);

  return {
    date: run.date,
    headline: run.digest.headline,
    lead: run.digest.lead,
    highlights: run.digest.highlights.map((highlight) => ({
      title: highlight.title_ja || highlight.title,
      source: highlight.service_label,
      reason: highlight.reason,
      anchor: anchors.get(highlight.url) ?? "",
    })),
    items,
  };
};
