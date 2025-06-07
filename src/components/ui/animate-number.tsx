import {
  type AnimateNumberProps,
  AnimateNumber as MotionAnimateNumber,
} from "motion-plus/react";
import { useEffect, useState } from "react";

export const AnimateNumber = ({
  count,
  className,
  ...props
}: Omit<AnimateNumberProps, "ref" | "children"> & { count: number }) => {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => setAnimatedCount(count), [count]);

  return <MotionAnimateNumber {...props}>{animatedCount}</MotionAnimateNumber>;
};
