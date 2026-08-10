/* The run JSON stores japan first, but the site leads with global. */
export const sortMarketsGlobalFirst = <T extends { id: string }>(markets: T[]): T[] =>
  markets.toSorted((a, b) => Number(a.id === "japan") - Number(b.id === "japan"));
