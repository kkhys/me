/* Number of items flagged seen_before — drives the 既出 filter's counts. */
export const countSeen = (items: readonly { seen_before: boolean }[]): number =>
  items.filter((item) => item.seen_before).length;
