import "server-only";
import { TZDate } from "@date-fns/tz";
import type { GraphQlQueryResponseData } from "@octokit/graphql";
import { unstable_cache } from "next/cache";
import type {
  AllDaysOfWeekData,
  AllTimeOfDayData,
  CommitNode,
  CommitsData,
} from "#/app/about/_types/github";
import { me } from "#/config/site";
import { graphql } from "#/lib/octokit";
import { categorizeDayOfWeek, categorizeTimeOfDay } from "#/utils/date";

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
    revalidate: false,
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
    revalidate: false,
  },
);

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
                    author {
                      user {
                        login
                      }
                    }
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
    revalidate: false,
  },
);

export const buildCommitsData = (allCommits: CommitNode[]): CommitsData => {
  const allDaysOfWeekData: AllDaysOfWeekData = {
    monday: { commits: 0, percentage: 0 },
    tuesday: { commits: 0, percentage: 0 },
    wednesday: { commits: 0, percentage: 0 },
    thursday: { commits: 0, percentage: 0 },
    friday: { commits: 0, percentage: 0 },
    saturday: { commits: 0, percentage: 0 },
    sunday: { commits: 0, percentage: 0 },
  };

  const allTimeOfDayData: AllTimeOfDayData = {
    morning: { commits: 0, percentage: 0 },
    daytime: { commits: 0, percentage: 0 },
    evening: { commits: 0, percentage: 0 },
    night: { commits: 0, percentage: 0 },
  };

  const commitsWithTokyoDate = allCommits.map((commit) => {
    const date = new TZDate(commit.committedDate, "Asia/Tokyo");

    return {
      ...commit,
      committedDate: date.toISOString(),
    };
  });

  for (const { committedDate } of commitsWithTokyoDate) {
    const date = new TZDate(committedDate, "Asia/Tokyo");

    const dayKey = categorizeDayOfWeek(date);
    // @ts-ignore
    allDaysOfWeekData[dayKey].commits++;

    const timeKey = categorizeTimeOfDay(date);
    // @ts-ignore
    allTimeOfDayData[timeKey].commits++;
  }

  const totalCommits = commitsWithTokyoDate.length;

  for (const obj of Object.values(allDaysOfWeekData)) {
    obj.percentage =
      totalCommits > 0
        ? Number.parseFloat(((obj.commits / totalCommits) * 100).toFixed(2))
        : 0;
  }

  for (const obj of Object.values(allTimeOfDayData)) {
    obj.percentage =
      totalCommits > 0
        ? Number.parseFloat(((obj.commits / totalCommits) * 100).toFixed(2))
        : 0;
  }

  return {
    totalCommits,
    allTimeOfDayData,
    allDaysOfWeekData,
    commits: commitsWithTokyoDate.map(({ author, ...rest }) => rest),
  };
};

export const fetchAndMergeCommits = async (
  sinceDate: string | null,
  cachedCommits: CommitNode[],
  useCache = true,
): Promise<CommitNode[]> => {
  if (!sinceDate) throw new Error("sinceDate is required");

  const repositories = useCache
    ? await getCachedUserRepositories()
    : await getUserRepositories();

  const allCommits: CommitNode[] = [];

  // 各リポジトリの全ブランチに対してコミットを取得
  for (const { name: repositoryName } of repositories) {
    const branches = useCache
      ? await getCachedRepositoryBranches(repositoryName)
      : await getRepositoryBranches(repositoryName);

    for (const { name: branchName } of branches) {
      const commits = useCache
        ? await getCachedRepositoryCommits(
            repositoryName,
            branchName,
            sinceDate,
          )
        : await getRepositoryCommits(repositoryName, branchName, sinceDate);
      allCommits.push(...commits);
    }
  }

  // ログイン中のユーザーのコミットにフィルタリング
  const filteredCommits = allCommits.filter(
    ({ author }) => author?.user?.login === me.github.id,
  );

  // ユニークなコミットをマージ
  const uniqueCommitsMap = new Map<string, CommitNode>();
  for (const commit of [...cachedCommits, ...filteredCommits]) {
    uniqueCommitsMap.set(commit.committedDate, { ...commit });
  }

  return Array.from(uniqueCommitsMap.values()).sort(
    (a, b) =>
      new Date(a.committedDate).getTime() - new Date(b.committedDate).getTime(),
  );
};
