export type CommitNode = {
  committedDate: string;
  author?: {
    user: {
      login: string;
    } | null;
  };
};

type TimePeriodData = {
  commits: number;
  percentage: number;
};

export type TimeOfDayName = "morning" | "daytime" | "evening" | "night";

export type AllTimeOfDayData = Record<TimeOfDayName, TimePeriodData>;

type DayOfWeekName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type AllDaysOfWeekData = Record<DayOfWeekName, TimePeriodData>;

export type CommitsData = {
  totalCommits: number;
  allTimeOfDayData: AllTimeOfDayData;
  allDaysOfWeekData: AllDaysOfWeekData;
  commits: Pick<CommitNode, "committedDate">[];
};
