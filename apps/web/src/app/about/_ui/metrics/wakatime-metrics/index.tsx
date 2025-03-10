import { cn } from "@kkhys/ui";
import { getAggregateData, getWakaTimeSummaries } from "#/app/about/_lib";
import { WakatimeCard, WakatimeCardSkeleton } from "#/app/about/_ui";

export const WakatimeMetrics = async ({
  className,
}: { className?: string }) => {
  const { data: summaries } = (await getWakaTimeSummaries()) || {};

  if (!summaries) {
    return <WakatimeMetricsSkeleton className={className} />;
  }

  const aggregatedData = [
    {
      title: "Programming Languages",
      data: getAggregateData(summaries, "languages", 5),
    },
    { title: "Editors", data: getAggregateData(summaries, "editors") },
    {
      title: "Operating Systems",
      data: getAggregateData(summaries, "operating_systems"),
    },
    { title: "Categories", data: getAggregateData(summaries, "categories") },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {aggregatedData.map(({ title, data }) => (
        <WakatimeCard key={title} title={title} chartData={data} />
      ))}
    </div>
  );
};

export const WakatimeMetricsSkeleton = ({
  className,
}: { className?: string }) => {
  const titles = [
    "Programming Languages",
    "Editors",
    "Operating Systems",
    "Categories",
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {titles.map((title) => (
        <WakatimeCardSkeleton key={title} title={title} />
      ))}
    </div>
  );
};
