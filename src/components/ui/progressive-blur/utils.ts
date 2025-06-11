export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export const generateLayers = ({
  layers,
  segmentSize,
  direction,
  blurIntensity,
}: {
  layers: number;
  segmentSize: number;
  direction: keyof typeof GRADIENT_ANGLES;
  blurIntensity: number;
}) =>
  Array.from({ length: layers }).map((_, index) => {
    const angle = GRADIENT_ANGLES[direction];
    const gradientStops = [
      index * segmentSize,
      (index + 1) * segmentSize,
      (index + 2) * segmentSize,
      (index + 3) * segmentSize,
    ].map(
      (pos, posIndex) =>
        `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
    );

    const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;

    return {
      gradient,
      blurAmount: index * blurIntensity,
    };
  });
