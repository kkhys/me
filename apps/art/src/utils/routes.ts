export const WORKS_SECTION = "/#works";
export const FASHION_SECTION = "/#fashion";

/** Two-digit sheet number, matching the `NN.jpg` file names. */
export const padNumber = (number: number): string => String(number).padStart(2, "0");

export const workPath = (slug: string): string => `/works/${slug}`;

export const fashionPath = (series: string, number: number): string =>
  `/fashion/${series}/${padNumber(number)}`;

// view-transition-name values must be CSS identifiers; the prefix keeps a
// slug that starts with a digit valid.
export const workTransitionName = (slug: string): string => `work-${slug}`;

export const fashionTransitionName = (series: string, number: number): string =>
  `fashion-${series}-${padNumber(number)}`;
