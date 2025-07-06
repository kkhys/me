import { sleep } from "k6";
import http from "k6/http";
import { Counter, Rate, Trend } from "k6/metrics";
import CONFIG from "./config.ts";
import {
  apiChecks,
  generateUserAgent,
  logError,
  printTestStats,
  recordMetrics,
  weightedRandom,
} from "./utils.ts";

export const errorRate = new Rate("errors");
export const apiResponseTime = new Trend("api_response_time");
export const requestCount = new Counter("requests");

export const options = {
  scenarios: {
    api_load: {
      executor: "constant-vus",
      vus: 5,
      duration: "5m",
    },
  },
  thresholds: {
    ...CONFIG.THRESHOLDS.api,
    api_response_time: ["p(95)<1000"],
    errors: ["rate<0.05"],
  },
};

const metrics = {
  responseTime: apiResponseTime,
  errorRate,
  requestCount,
};

export default function () {
  printTestStats({ startTime: new Date().toISOString() });

  const params = {
    headers: {
      "User-Agent": generateUserAgent("api-load-test"),
      Accept: "application/json",
    },
  };

  // 1. GitHub コントリビューションAPI
  // let response = http.get(
  //   `${CONFIG.BASE_URL}/api/github/contributions`,
  //   params,
  // );
  // apiChecks(response, "GitHub_API", validateGithubResponse);
  // logError(
  //   response,
  //   `${CONFIG.BASE_URL}/api/github/contributions`,
  //   "GitHub API",
  // );
  // recordMetrics(response, metrics, "github_contributions");
  //
  // sleep(1);

  // 2. Spotify API
  // response = http.get(`${CONFIG.BASE_URL}/api/spotify`, params);
  // apiChecks(response, "Spotify_API", validateSpotifyResponse);
  // logError(response, `${CONFIG.BASE_URL}/api/spotify`, "Spotify API");
  // recordMetrics(response, metrics, "spotify");
  //
  // sleep(1);

  // 3. GitHub ファイル更新日時API（重み付きランダム選択）
  // const testPaths = [
  //   { item: "bucket-list/data.yaml", weight: 1 },
  //   { item: "blog/2020-05-18/index.mdx", weight: 2 },
  //   { item: "blog/2023-12-31/index.mdx", weight: 2 },
  //   { item: "blog/2024-01-20/index.mdx", weight: 3 }, // 新しい記事の重み大
  // ];
  //
  // const randomPath = weightedRandom(testPaths);
  // response = http.get(
  //   `${CONFIG.BASE_URL}/api/github/last-updated-file?path=${encodeURIComponent(randomPath)}`,
  //   params,
  // );

  // GitHub ファイルAPI専用バリデーター
  // const githubFileValidator = (data: unknown): boolean => {
  //   return (
  //     typeof data === "object" &&
  //     data !== null &&
  //     typeof (data as Record<string, unknown>).lastUpdatedTime !== "undefined"
  //   );
  // };
  //
  // apiChecks(response, "GitHub_File_API", githubFileValidator);
  // logError(
  //   response,
  //   `${CONFIG.BASE_URL}/api/github/last-updated-file`,
  //   "GitHub File API",
  // );
  // recordMetrics(response, metrics, "github_file");
  //
  // sleep(2);

  let response: http.Response;

  // 4. OpenGraph画像生成API（負荷が高いため頻度を下げる）
  if (Math.random() < 0.2) {
    const ogImages = [
      { item: "default", weight: 3 },
      { item: "b1y4nft", weight: 2 },
      { item: "b1fw2ts", weight: 2 },
    ];

    const randomId = weightedRandom(ogImages);
    response = http.get(`${CONFIG.BASE_URL}/api/og/${randomId}.png`, {
      headers: {
        "User-Agent": generateUserAgent("api-load-test"),
        Accept: "image/png",
      },
    });

    // OG画像専用バリデーター
    const ogImageValidator = (data: unknown): boolean => {
      return typeof data === "string" && data.length > 1000; // 最低1KB
    };

    apiChecks(response, "OG_Image", ogImageValidator);
    logError(response, `${CONFIG.BASE_URL}/api/og/${randomId}.png`, "OG Image");
    recordMetrics(response, metrics, "og_image");

    sleep(1);
  }

  // エラーハンドリングテスト（10%の確率）
  if (Math.random() < 0.1) {
    response = http.get(`${CONFIG.BASE_URL}/api/nonexistent`, params);

    // 404エラー専用バリデーター
    const errorValidator = (): boolean => {
      return response.status === 404 || response.status === 500;
    };

    apiChecks(response, "Error_Handling", errorValidator);
    recordMetrics(response, metrics, "error_test");
  }
}
