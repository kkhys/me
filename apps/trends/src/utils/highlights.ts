interface ItemRef {
  url: string;
}

interface ServiceRef {
  id: string;
  label: string;
  items: readonly ItemRef[];
}

interface MarketRef {
  id: string;
  services: readonly ServiceRef[];
}

interface HighlightRef {
  url: string;
  service_label: string;
}

/* Anchor id of one item row: market → service → 1-based rank. */
export const itemAnchorId = (marketId: string, serviceId: string, rank: number): string =>
  `${marketId}-${serviceId}-${rank}`;

/* Maps each highlight URL to the anchor of the row it came from. The digest
   stores only the service label, so the label is matched first; the same
   story can sit in several services on one day, so a URL-only match is the
   fallback. Highlights with no matching row are left out. */
export const highlightAnchors = (
  markets: readonly MarketRef[],
  highlights: readonly HighlightRef[],
): Map<string, string> => {
  const rows = markets.flatMap((market) =>
    market.services.flatMap((service) =>
      service.items.map((item, i) => ({
        url: item.url,
        label: service.label,
        anchor: itemAnchorId(market.id, service.id, i + 1),
      })),
    ),
  );

  const anchors = new Map<string, string>();

  for (const highlight of highlights) {
    const row =
      rows.find((r) => r.url === highlight.url && r.label === highlight.service_label) ??
      rows.find((r) => r.url === highlight.url);

    if (row) {
      anchors.set(highlight.url, row.anchor);
    }
  }

  return anchors;
};
