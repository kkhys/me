import HeatMap, { type SVGProps } from "@uiw/react-heat-map";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
      // biome-ignore lint/a11y/noStaticElementInteractions: xxx
      <rect
        className="transition-all hover:brightness-125 focus:outline-none"
        onMouseEnter={() => handleMouseEnter(tileInfo)}
        onFocus={() => handleMouseEnter(tileInfo)}
        tabIndex={0}
        aria-label={tileInfo}
        {...props}
      />
    );
  };

export const GithubActivityChart = memo((props: Props) => {
  const defaultValue = `過去1年間で${formatNumber(props.totalContributions)}件のコントリビューション`;
  const [hoveredTile, setHoveredTile] = useState<string | null>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const dateProps = useMemo(() => getDateProps(), []);

  const panelColors = useMemo(
    () => ({
      1: "var(--github-heatmap-level-1)",
      4: "var(--github-heatmap-level-2)",
      8: "var(--github-heatmap-level-3)",
      12: "var(--github-heatmap-level-4)",
    }),
    [],
  );

  const handleMouseLeave = useCallback(
    () => setHoveredTile(defaultValue),
    [defaultValue],
  );

  const handleMouseEnter = useCallback(
    (date: string) => setHoveredTile(date),
    [],
  );

  const heatMapProps = useMemo(
    () => ({
      ...dateProps,
      onMouseLeave: handleMouseLeave,
      value: props.contributions ?? [],
      weekLabels: false as const,
      monthLabels: false as const,
      legendCellSize: 0,
      space: 8,
      style: { color: "var(--uchu-yang)" as const },
      rectProps: { rx: 2 },
      rectSize: 12,
      rectRender: renderRect(handleMouseEnter),
      panelColors,
      className: "w-[265px] h-[139px]",
    }),
    [
      dateProps,
      handleMouseLeave,
      props.contributions,
      handleMouseEnter,
      panelColors,
    ],
  );

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
});
