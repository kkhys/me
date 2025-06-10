import { GITHUB_ACCESS_TOKEN } from "astro:env/server";
import request, { gql } from "graphql-request";
import { me } from "#/config/site";

type GithubContributionDay = {
  count: number;
  date: string;
};

export type GithubContributionData = {
  totalContributions: number;
  contributions: GithubContributionDay[];
};

const GetGithubContributions = gql`
  query ($userName: String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

type GithubContributionResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            date: string;
          }>;
        }>;
      };
    };
  };
};

export const getGithubContributions =
  async (): Promise<GithubContributionData> => {
    const response = await request<GithubContributionResponse>({
      url: "https://api.github.com/graphql",
      document: GetGithubContributions,
      variables: { userName: me.github.id },
      requestHeaders: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      },
    });

    const parsedResponse =
      response.user.contributionsCollection.contributionCalendar;

    return {
      totalContributions: parsedResponse.totalContributions,
      contributions: parsedResponse.weeks.flatMap((week) => {
        return week.contributionDays.map((day) => {
          return {
            count: day.contributionCount,
            date: day.date.replace(/-/g, "/"),
          };
        });
      }),
    };
  };
