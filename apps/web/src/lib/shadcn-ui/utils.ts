import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single merged string.
 *
 * @param inputs - Multiple class values to be merged.
 * @returns Merged class values as a string.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
