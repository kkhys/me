export const dayOfWeekNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const timeOfDayRanges = [
  { key: "morning", start: 6, end: 11 },
  { key: "daytime", start: 12, end: 17 },
  { key: "evening", start: 18, end: 23 },
  { key: "night", start: 0, end: 5 },
] as const;
