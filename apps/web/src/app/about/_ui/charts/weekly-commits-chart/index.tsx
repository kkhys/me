"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@kkhys/ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { AllDaysOfWeekData } from "#/app/about/_types";

const chartConfig = {
  commits: {
    label: "Commits",
    color: "oklch(var(--chart-weekly))",
  },
} satisfies ChartConfig;

export const WeeklyCommitsChart = ({ data }: { data: AllDaysOfWeekData }) => {
  const chartData = Object.entries(data).map(([day, timePeriodData]) => ({
    dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
    commits: timePeriodData.commits,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="dayOfWeek"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        {/*<YAxis tickMargin={10} />*/}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideIndicator />}
        />
        <Bar
          dataKey="commits"
          fill="var(--color-commits)"
          barSize={20}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
};
