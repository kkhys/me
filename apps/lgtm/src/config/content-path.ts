/**
 * CI builds run without the private lgtm-content submodule, so fixture
 * entries stand in whenever USE_FIXTURE_DATA is set.
 */
export const resolveLgtmBasePath = (useFixtures: boolean): string =>
  useFixtures ? "./src/__fixtures__/lgtm-sample" : "./lgtm-content/lgtm";
