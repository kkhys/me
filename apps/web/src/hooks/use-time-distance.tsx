import * as React from 'react';
import { formatDistanceStrict, parseISO } from 'date-fns';

/**
 * Calculates the time distance from a given date to the current date.
 *
 * @param date - The date in ISO string format.
 * @return The time distance in string format or null if date is invalid.
 */
export const useTimeDistance = (date: string) => {
  const [distance, setDistance] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timeDistance = formatDistanceStrict(parseISO(date), new Date());
    setDistance(timeDistance);
  }, [date]);

  return distance;
};
