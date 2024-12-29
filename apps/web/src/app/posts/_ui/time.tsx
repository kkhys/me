"use client";

import type { Post } from "contentlayer/generated";
import { formatDistanceStrict, parseISO } from "date-fns";
import * as React from "react";

const useTimeDistance = (date: string) => {
  const [distance, setDistance] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timeDistance = formatDistanceStrict(parseISO(date), new Date());
    setDistance(timeDistance);
  }, [date]);

  return distance;
};

export const Time = ({
  publishedAtFormattedUs,
  publishedAt,
}: Pick<Post, "publishedAtFormattedUs" | "publishedAt">) => {
  const timeDistance = useTimeDistance(publishedAt);

  return (
    <time
      dateTime={publishedAt}
      className="font-sans text-sm text-muted-foreground"
    >
      {publishedAtFormattedUs}
      {timeDistance && `（${timeDistance} ago）`}
    </time>
  );
};
