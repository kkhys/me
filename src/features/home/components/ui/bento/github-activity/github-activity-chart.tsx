import HeatMap, { type SVGProps } from "@uiw/react-heat-map";
import { useEffect, useState } from "react";
import { cn } from "#/lib/ui";
import type { GithubContributionData } from "#/pages/api/_services/github/contributions";

interface Props extends GithubContributionData {}

const formatNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat("ja-JP");
  return formatter.format(value);
};

const getDateProps = () => {
  const today = new Date();
  const sevenWeeksAgo = new Date();
  sevenWeeksAgo.setDate(today.getDate() - 7 * 12);

  return { startDate: sevenWeeksAgo, endDate: today };
};

const renderRect =
  (
    handleMouseEnter: (date: string) => void,
  ): NonNullable<SVGProps["rectRender"]> =>
  (props, data) => {
    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString("ja-JP", {
      day: "numeric",
      month: "long",
    });
    const tileInfo = `${data.count ? formatNumber(data.count) : "0"}件のコントリビューション - ${formattedDate}`;

    return (
      <rect
        className="transition-all hover:brightness-125"
        onMouseEnter={() => handleMouseEnter(tileInfo)}
        {...props}
      />
    );
  };

export const GithubActivityChart = (props: Props) => {
  const defaultValue = `過去1年間で${formatNumber(props.totalContributions)}件のコントリビューション`;
  const [hoveredTile, setHoveredTile] = useState<string | null>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const heatMapProps = {
    ...getDateProps(),
    onMouseLeave: () => setHoveredTile(defaultValue),
    value: props.contributions ?? [],
    weekLabels: false as const,
    monthLabels: false as const,
    legendCellSize: 0,
    space: 8,
    style: { color: "#fff" as const },
    rectProps: { rx: 2 },
    rectSize: 12,
    rectRender: renderRect((date) => setHoveredTile(date)),
    panelColors: {
      1: "var(--github-heatmap-level-1)",
      4: "var(--github-heatmap-level-2)",
      8: "var(--github-heatmap-level-3)",
      12: "var(--github-heatmap-level-4)",
    },
    className: "w-[265px] h-[139px]",
  };

  return (
    <div className="flex flex-col justify-between gap-1 p-1.5">
      <p className="line-clamp-1 text-[13px] text-muted-foreground">
        {hoveredTile}
      </p>
      <div
        className={cn(
          "flex justify-start md:justify-end transition-all duration-300 ease-in-out",
          isLoaded ? "blur-0 opacity-100" : "blur-sm opacity-70",
        )}
      >
        <HeatMap {...heatMapProps} />
      </div>
    </div>
  );
};
