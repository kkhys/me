"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@kkhys/ui/chart";
import React from "react";
import { Pie, PieChart } from "recharts";
import type {
  AllTimeOfDayData,
  TimeOfDayName,
} from "#/app/about/_types/github";

export const TimeOfDayCommitsChart = ({ data }: { data: AllTimeOfDayData }) => {
  const chartData = Object.entries(data).map(([time, timePeriodData]) => ({
    timeOfDay: time,
    commits: timePeriodData.commits,
    fill: `var(--color-${time})`,
  }));

  const chartConfig = (Object.keys(data) as TimeOfDayName[]).reduce(
    (config: Record<TimeOfDayName, { label: string; color: string }>, time) => {
      config[time] = {
        label: time.charAt(0).toUpperCase() + time.slice(1),
        color: `oklch(var(--chart-${time}))`,
      };
      return config;
    },
    {} as Record<TimeOfDayName, { label: string; color: string }>,
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="commits"
          nameKey="timeOfDay"
          innerRadius={60}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="timeOfDay" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
};
