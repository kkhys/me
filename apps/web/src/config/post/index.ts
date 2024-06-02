export type Base = Record<'title' | 'slug' | 'emoji', string>;

/**
 * Extracts the 'title' property from the given object.
 *
 * @template T - The type of object containing the 'title' property.
 * @param item - The object from which to extract the 'title'.
 * @return The value of the 'title' property.
 */
export const extractTitle = <T extends Pick<Base, 'title'>>(item: T) => item.title;

export * from './tag';
export * from './category';
