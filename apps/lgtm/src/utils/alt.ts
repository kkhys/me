/**
 * Alt for a rendered LGTM image: the overlaid text first, then what the
 * source picture shows, so a screen reader hears both the point and the joke.
 */
export const lgtmAlt = (description: string): string => `LGTM over ${description.trim()}`;
