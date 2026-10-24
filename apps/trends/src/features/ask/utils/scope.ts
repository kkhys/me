import type { AskScope } from "#/features/ask/types";

/* Date arithmetic for the dialog's scopes. Run ids are ISO dates, so the
   maths runs in UTC on `YYYY-MM-DD` strings and never touches the local
   clock, which would shift a date across midnight for some readers. */

/** Days a bounded scope covers, the open day included. */
export const SCOPE_DAYS: Record<Exclude<AskScope, "all">, number> = { day: 1, week: 7, month: 30 };

export const isAskScope = (value: unknown): value is AskScope =>
  value === "day" || value === "week" || value === "month" || value === "all";

/** Inclusive ISO dates. */
export interface DateRange {
  start: string;
  end: string;
}

const DAY_MS = 86_400_000;

const toUtc = (date: string): number => Date.parse(`${date}T00:00:00Z`);

export const shiftDate = (date: string, days: number): string =>
  new Date(toUtc(date) + days * DAY_MS).toISOString().slice(0, 10);

/** Calendar days from `start` to `end`, both included. */
export const daysBetween = (start: string, end: string): number =>
  Math.round((toUtc(end) - toUtc(start)) / DAY_MS) + 1;

export const monthOf = (date: string): string => date.slice(0, 7);

/**
 * The days a scope covers on `date`'s page: the open day, the 7 or 30 days
 * ending on it, or everything from the first run. Never reaches before
 * `firstDate`, so an early page gets a shorter range rather than missing days.
 */
export const scopeRange = (scope: AskScope, date: string, firstDate: string): DateRange => {
  if (scope === "all") return { start: firstDate, end: date };
  const start = shiftDate(date, 1 - SCOPE_DAYS[scope]);
  return { start: start < firstDate ? firstDate : start, end: date };
};

/** The range of the same length just before `range`; `undefined` before the first run. */
export const previousRange = (range: DateRange, firstDate: string): DateRange | undefined => {
  const end = shiftDate(range.start, -1);
  if (end < firstDate) return undefined;
  const start = shiftDate(range.start, -daysBetween(range.start, range.end));
  return { start: start < firstDate ? firstDate : start, end };
};

export const inRange = (date: string, range: DateRange): boolean =>
  date >= range.start && date <= range.end;

/** The `YYYY-MM` months a range touches, ascending. */
export const monthsOf = (range: DateRange): string[] => {
  const months: string[] = [];
  const last = monthOf(range.end);
  let [year, month] = range.start.split("-").map(Number) as [number, number];
  for (;;) {
    const id = `${year}-${String(month).padStart(2, "0")}`;
    months.push(id);
    if (id >= last) return months;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
};

/** The range as the model is told it: one date, or `start〜end（n 日間）`. */
export const describeRange = (range: DateRange): string =>
  range.start === range.end
    ? range.start
    : `${range.start}〜${range.end}（${daysBetween(range.start, range.end)} 日間）`;

/** "2026-10-18" → "10月18日", the form the model is asked to write dates in. */
export const jaDate = (date: string): string => {
  const [, month, day] = date.split("-").map(Number);
  return `${month}月${day}日`;
};
