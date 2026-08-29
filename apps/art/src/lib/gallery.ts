import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";
// Resolved by the `#gallery-images` alias in astro.config.ts to either the
// art-content or the fixture image tree, so only one of them is bundled.
import { fashionModules, workModules } from "#gallery-images";
import { sortByOrder } from "#/utils/caption";
import { buildFashionSeries, type FashionSeries } from "#/utils/fashion";
import { buildWorks, type Work } from "#/utils/works";

export const loadWorks = async (): Promise<Work<ImageMetadata>[]> =>
  buildWorks(sortByOrder((await getCollection("works")).map(({ data }) => data)), workModules);

export const loadFashionSeries = async (): Promise<FashionSeries<ImageMetadata>[]> =>
  buildFashionSeries(
    sortByOrder((await getCollection("fashion")).map(({ data }) => data)),
    fashionModules,
  );
