import { Card, CardContent, CardHeader, CardTitle } from "@kkhys/ui/card";

export const ChartCard = ({
  title,
  children,
  ...props
}: { title: string } & React.ComponentProps<typeof Card>) => (
  <Card {...props}>
    <CardHeader className="font-sans">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);
