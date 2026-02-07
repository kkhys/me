/**
 * Bento grid item size definitions
 *
 * @description Type-safe management of grid layout size variations
 * @example
 * ```typescript
 * import { BENTO_SIZES, type BentoSizeOrCustom } from "./bento-sizes";
 *
 * const size: BentoSizeOrCustom = "1x1";
 * const sizeClasses = BENTO_SIZES[size as keyof typeof BENTO_SIZES];
 * ```
 */

export const BENTO_SIZES = {
  "1x1": "col-span-1 row-span-1 md:col-span-2 aspect-square",
  "1x2": "col-span-1 row-span-2 md:col-span-2 aspect-[1/2]",
  "2x1": "col-span-1 row-span-1 md:col-span-4 aspect-[2/1]",
  "2x2": "col-span-1 row-span-2 md:col-span-4 aspect-square",
} as const;

type BentoSize = keyof typeof BENTO_SIZES;

/**
 * Type that accepts either a custom size class or a predefined size key
 *
 * @description Enables flexible size specification in BentoItemBase
 */
export type BentoSizeOrCustom = BentoSize | (string & {});
