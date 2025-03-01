"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
} from "@kkhys/ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { Aggregate } from "#/app/about/_lib";

const aggregateToChartConfig = (aggregates: Aggregate[]) =>
  aggregates.reduce((config, { id, label, color }) => {
    config[id] = {
      label,
      color,
    };
    return config;
  }, {} as ChartConfig);

const formatSecondsToHMS = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};

export const WakatimeChart = ({ chartData }: { chartData: Aggregate[] }) => {
  const chartConfig = aggregateToChartConfig(chartData);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
          className="font-sans"
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _, { payload: { fill } }) => (
                <div className="flex min-w-[130px] items-center font-sans text-xs text-muted-foreground">
                  <div
                    className="size-2.5 shrink-0 rounded-[2px] bg-[--color-bg] mr-1.5"
                    style={
                      {
                        "--color-bg": fill,
                      } as React.CSSProperties
                    }
                  />
                  Time
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {formatSecondsToHMS(Number(value))}
                  </div>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="total_seconds" barSize={20} radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export const WakatimeChartSkeleton = () => <Skeleton className="h-[200px]" />;
