/**
 * CI builds run without the private art-content submodule, so fixture
 * captions and images stand in whenever USE_FIXTURE_DATA is set.
 */
export const useFixtureData = (): boolean => process.env.USE_FIXTURE_DATA === "true";

/** Root-relative base for the content collection loaders. */
export const resolveContentBase = (useFixtures: boolean): string =>
  useFixtures ? "./src/__fixtures__" : "./art-content";
