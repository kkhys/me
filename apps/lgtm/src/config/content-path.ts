/**
 * CI builds run without the private lgtm-content submodule, so fixture
 * entries stand in whenever GITHUB_ACTIONS is set.
 */
export const resolveLgtmBasePath = (githubActions: boolean): string =>
  githubActions ? "./src/__fixtures__/lgtm-sample" : "./lgtm-content/lgtm";
