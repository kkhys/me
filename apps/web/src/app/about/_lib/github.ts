import "server-only";
import type { GraphQlQueryResponseData } from "@octokit/graphql";
import { unstable_cache } from "next/cache";
import { me } from "#/config";
import { graphql } from "#/lib/octokit";

const owner = me.github.id;

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

type QueryVariables = Record<string, string | number | null>;

type PaginationResponse<TNode> = {
  nodes: TNode[];
  pageInfo: PageInfo;
};

const paginateQuery = async <TResponse extends GraphQlQueryResponseData, TNode>(
  query: string,
  variables: QueryVariables,
  extractNodesAndPageInfo: (response: TResponse) => PaginationResponse<TNode>,
): Promise<TNode[]> => {
  const allNodes: TNode[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response: TResponse = await graphql<TResponse>(query, {
      ...variables,
      after,
    });

    const { nodes, pageInfo } = extractNodesAndPageInfo(response);

    allNodes.push(...nodes);
    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor;
  }

  return allNodes;
};

type RepositoryNode = {
  name: string;
};

type GetUserRepositoriesResponse = GraphQlQueryResponseData & {
  user: {
    repositories: {
      edges: { node: RepositoryNode }[];
      pageInfo: PageInfo;
    };
  };
};

export const getUserRepositories = async (): Promise<RepositoryNode[]> => {
  const QUERY = `
    query GetUserRepositories($username: String!, $after: String) {
      user(login: $username) {
        repositories(first: 100, after: $after) {
          edges {
            node {
              name
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  return paginateQuery<GetUserRepositoriesResponse, RepositoryNode>(
    QUERY,
    { username: owner },
    (response) => ({
      nodes: response.user.repositories.edges.map((edge) => edge.node),
      pageInfo: response.user.repositories.pageInfo,
    }),
  );
};

export const getCachedUserRepositories = unstable_cache(
  async () => getUserRepositories(),
  undefined,
  {
    revalidate: 60 * 60,
  },
);

type BranchNode = {
  name: string;
};

type GetRepositoryBranchesResponse = GraphQlQueryResponseData & {
  repository: {
    refs: {
      edges: { node: BranchNode }[];
      pageInfo: PageInfo;
    };
  };
};

export const getRepositoryBranches = async (
  repositoryName: string,
): Promise<BranchNode[]> => {
  const QUERY = `
    query GetRepositoryBranches($owner: String!, $name: String!, $after: String) {
      repository(owner: $owner, name: $name) {
        refs(refPrefix: "refs/heads/", first: 100, after: $after) {
          edges {
            node {
              name
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  return paginateQuery<GetRepositoryBranchesResponse, BranchNode>(
    QUERY,
    { owner, name: repositoryName },
    (response) => ({
      nodes: response.repository.refs.edges.map((edge) => edge.node),
      pageInfo: response.repository.refs.pageInfo,
    }),
  );
};

export const getCachedRepositoryBranches = unstable_cache(
  async (repositoryName: string) => getRepositoryBranches(repositoryName),
  undefined,
  {
    revalidate: 60 * 60,
  },
);

type CommitNode = {
  committedDate: string;
};

type GetRepositoryCommitsResponse = GraphQlQueryResponseData & {
  repository: {
    ref: {
      target: {
        history: {
          edges: { node: CommitNode }[];
          pageInfo: PageInfo;
        };
      };
    } | null;
  };
};

export const getRepositoryCommits = async (
  repositoryName: string,
  branch: string,
  since: string,
): Promise<CommitNode[]> => {
  const QUERY = `
    query GetRepositoryCommits($owner: String!, $name: String!, $branch: String!, $since: GitTimestamp!, $after: String) {
      repository(owner: $owner, name: $name) {
        ref(qualifiedName: $branch) {
          target {
            ... on Commit {
              history(first: 100, since: $since, after: $after) {
                edges {
                  node {
                    committedDate
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        }
      }
    }
  `;

  return paginateQuery<GetRepositoryCommitsResponse, CommitNode>(
    QUERY,
    { owner, name: repositoryName, branch, since },
    (response) => {
      const history = response.repository.ref?.target.history;

      return {
        nodes: history ? history.edges.map((edge) => edge.node) : [],
        pageInfo: history
          ? history.pageInfo
          : { hasNextPage: false, endCursor: null },
      };
    },
  );
};

export const getCachedRepositoryCommits = unstable_cache(
  async (repositoryName: string, branch: string, since: string) =>
    getRepositoryCommits(repositoryName, branch, since),
  undefined,
  {
    revalidate: 60 * 60,
  },
);
