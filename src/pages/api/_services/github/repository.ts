import { GITHUB_ACCESS_TOKEN } from "astro:env/server";
import request, { gql } from "graphql-request";

type GithubRepositoryResponse = {
  repository: {
    name: string;
    description: string;
    forkCount: number;
    stargazerCount: number;
    url: string;
    pushedAt: string;
    updatedAt: string;
  };
};

export const GetRepository = gql`
  query ($username: String!, $repositoryName: String!) {
    repository(name: $repositoryName, owner: $username) {
      id
      name
      nameWithOwner
      description
      forkCount
      stargazerCount
      openGraphImageUrl
      pushedAt
      updatedAt
      url
    }
  }
`;

export const getLastUpdatedTime = async (owner: string, repository: string) => {
  const response = await request<GithubRepositoryResponse>({
    url: "https://api.github.com/graphql",
    document: GetRepository,
    variables: { username: owner, repositoryName: repository },
    requestHeaders: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    },
  });

  return response.repository;
};
