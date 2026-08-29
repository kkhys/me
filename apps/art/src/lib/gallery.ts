import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";
import { useFixtureData } from "#/config/content-path";
import { sortByOrder } from "#/utils/caption";
import { buildFashionSeries, type FashionSeries } from "#/utils/fashion";
import { buildWorks, type Work } from "#/utils/works";

type Modules = Record<string, { default: ImageMetadata }>;

// Glob patterns must be literals, so both trees are declared and one is picked.
const workModules: Modules = useFixtureData()
  ? import.meta.glob("../__fixtures__/works/*.jpg", { eager: true })
  : import.meta.glob("../../art-content/works/*.jpg", { eager: true });
const fashionModules: Modules = useFixtureData()
  ? import.meta.glob("../__fixtures__/fashion/*/*.jpg", { eager: true })
  : import.meta.glob("../../art-content/fashion/*/*.jpg", { eager: true });

export const loadWorks = async (): Promise<Work<ImageMetadata>[]> =>
  buildWorks(sortByOrder((await getCollection("works")).map(({ data }) => data)), workModules);

export const loadFashionSeries = async (): Promise<FashionSeries<ImageMetadata>[]> =>
  buildFashionSeries(
    sortByOrder((await getCollection("fashion")).map(({ data }) => data)),
    fashionModules,
  );
