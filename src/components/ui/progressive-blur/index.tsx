import { type HTMLMotionProps, motion } from "motion/react";
import { cn } from "#/lib/ui";
import { type GRADIENT_ANGLES, generateLayers } from "./utils";

type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<"div">;

export const ProgressiveBlurReact = ({
  direction = "bottom",
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) => {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);

  const layerData = generateLayers({
    direction,
    layers,
    segmentSize,
    blurIntensity,
  });

  return (
    <div className={cn("relative", className)}>
      {layerData.map(({ gradient, blurAmount }) => (
        <motion.div
          key={gradient}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            maskImage: gradient,
            WebkitMaskImage: gradient,
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }}
          {...props}
        />
      ))}
    </div>
  );
};
