import { Card, CardContent, CardHeader, CardTitle } from "@kkhys/ui";
import type { Aggregate } from "#/app/about/_lib";
import { WakatimeChart, WakatimeChartSkeleton } from "#/app/about/_ui";

export const WakatimeCard = ({
  title,
  chartData,
  ...props
}: { title: string; chartData: Aggregate[] } & React.ComponentProps<
  typeof Card
>) => (
  <Card {...props}>
    <CardHeader className="font-sans">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <WakatimeChart chartData={chartData} />
    </CardContent>
  </Card>
);

export const WakatimeCardSkeleton = ({
  title,
  ...props
}: { title: string } & React.ComponentProps<typeof Card>) => (
  <Card {...props}>
    <CardHeader className="font-sans">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <WakatimeChartSkeleton />
    </CardContent>
  </Card>
);
