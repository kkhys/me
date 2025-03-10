import type { AllDaysOfWeekData } from "#/app/about/_types";
import { dayOfWeekNames, timeOfDayRanges } from "#/config";

export const formatPublishedDate = (publishedDate: Date | string | number) =>
  new Date(publishedDate).toISOString().split("T")[0];

export const categorizeDayOfWeek = (date: Date) => {
  const day = (date.getDay() + 6) % 7;
  return dayOfWeekNames[day] as keyof AllDaysOfWeekData;
};

export const categorizeTimeOfDay = (date: Date) => {
  const hour = date.getHours();

  for (const { start, end, key } of timeOfDayRanges) {
    if (start <= end) {
      if (hour >= start && hour <= end) {
        return key;
      }
    } else {
      if (hour >= start || hour <= end) {
        return key;
      }
    }
  }

  return "night";
};
