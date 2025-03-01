import "server-only";
import { graphql } from "@octokit/graphql";
import { env } from "#/env";

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${env.GITHUB_ACCESS_TOKEN}`,
  },
});

export { graphqlWithAuth as graphql };
