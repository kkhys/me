// Fashion sheets are named `NN.jpg` by art-content's ingest script. These two
// are the only place that convention is parsed and printed, so they round-trip.

const SHEET_NAME_PATTERN = /^\d+$/u;

/** File name (without extension) to sheet number, or undefined when it is not numeric. */
export const parseSheetNumber = (name: string): number | undefined =>
  SHEET_NAME_PATTERN.test(name) ? Number(name) : undefined;

/** Two-digit sheet number for routes, names, and captions. */
export const padNumber = (number: number): string => String(number).padStart(2, "0");
