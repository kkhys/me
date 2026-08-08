/**
 * Clamp a meta description. With `ellipsis`, over-long text is cut to leave
 * room for a trailing "..."; otherwise it is hard-sliced at `maxLength`.
 */
export const truncateDescription = (
  description: string,
  maxLength: number,
  ellipsis: boolean,
): string =>
  ellipsis && description.length > maxLength
    ? `${description.slice(0, Math.max(0, maxLength - 3))}...`
    : description.slice(0, maxLength);
