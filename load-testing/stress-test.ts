import { sleep } from "k6";
import http from "k6/http";
import { Counter, Rate, Trend } from "k6/metrics";
import CONFIG from "./config.ts";
import {
  basicChecks,
  generateUserAgent,
  logError,
  printTestStats,
  randomSleep,
  recordMetrics,
  retryRequest,
  weightedRandom,
} from "./utils.ts";

export const errorRate = new Rate("errors");
export const responseTime = new Trend("response_time");
export const requestCount = new Counter("requests");

// ストレステスト設定
export const options = {
  scenarios: {
    stress_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 20 },
        { duration: "5m", target: 50 },
        { duration: "2m", target: 100 },
        { duration: "5m", target: 100 },
        { duration: "5m", target: 200 }, // 極限テスト
        { duration: "2m", target: 0 },
      ],
    },
    spike_test: CONFIG.SCENARIOS.spike_test,
  },
  thresholds: CONFIG.THRESHOLDS.stress,
};

const metrics = {
  responseTime,
  errorRate,
  requestCount,
};

export default () => {
  printTestStats({ startTime: new Date().toISOString() });

  // 重み付きURL選択（人気ページの重みを大きく）
  const urlWeights = [
    ...CONFIG.URLS.pages.map((page) => ({
      item: page,
      weight: page === "/" ? 5 : page === "/blog" ? 3 : 1,
    })),
    ...CONFIG.URLS.blogPosts.map((post) => ({
      item: post,
      weight: 2,
    })),
  ];

  const selectedUrl = weightedRandom(urlWeights);
  const fullUrl = `${CONFIG.BASE_URL}${selectedUrl}`;

  const params = {
    headers: {
      "User-Agent": generateUserAgent("stress-test"),
      Accept: selectedUrl.startsWith("/api/")
        ? "application/json"
        : "text/html,application/xhtml+xml",
    },
    timeout: "10s",
  };

  // リトライ機能付きリクエスト
  const response = retryRequest(() => http.get(fullUrl, params), 2, 0.5);

  // ストレステスト用のより緩い閾値でチェック
  basicChecks(response, "Stress_test", 200, 5000);
  logError(response, fullUrl, "Stress test");
  recordMetrics(response, metrics, "stress_page");

  // 負荷軽減のため短いランダムスリープ
  sleep(randomSleep(0.2, 0.8));

  // 追加の負荷パターン（確率的）
  if (Math.random() < CONFIG.USER_BEHAVIOR.probabilities.view_additional_page) {
    const additionalUrl = weightedRandom(urlWeights);
    const additionalResponse = http.get(
      `${CONFIG.BASE_URL}${additionalUrl}`,
      params,
    );

    basicChecks(additionalResponse, "Additional_stress", 200, 5000);
    logError(
      additionalResponse,
      `${CONFIG.BASE_URL}${additionalUrl}`,
      "Additional stress",
    );
    recordMetrics(additionalResponse, metrics, "stress_additional");

    sleep(randomSleep(0.1, 0.3));
  }

  // 高負荷時のAPIテスト（低確率）
  if (Math.random() < 0.1) {
    const apiUrls = CONFIG.URLS.api.map((api) => ({
      item: api,
      weight: 1,
    }));

    if (apiUrls.length > 0) {
      const selectedApi = weightedRandom(apiUrls);
      const apiResponse = http.get(`${CONFIG.BASE_URL}${selectedApi}`, {
        headers: {
          "User-Agent": generateUserAgent("stress-test"),
          Accept: "application/json",
        },
        timeout: "15s", // APIは長めのタイムアウト
      });

      basicChecks(apiResponse, "Stress_API", 200, 10000);
      logError(apiResponse, `${CONFIG.BASE_URL}${selectedApi}`, "Stress API");
      recordMetrics(apiResponse, metrics, "stress_api");

      sleep(randomSleep(0.5, 1.5));
    }
  }
};

// テスト開始時のセットアップ
export const setup = () => {
  console.log("🚀 ストレステスト開始");
  console.log(`ターゲットURL: ${CONFIG.BASE_URL}`);
  console.log(`モニタリング設定: ${JSON.stringify(CONFIG.MONITORING)}`);

  // ベースラインチェック
  const response = http.get(`${CONFIG.BASE_URL}/`);
  if (response.status !== 200) {
    throw new Error(`サーバーが応答しません: ${response.status}`);
  }

  return { startTime: new Date().toISOString() };
};

// テスト終了時のクリーンアップ
export const teardown = (data: { startTime: string }) => {
  console.log("✅ ストレステスト完了");
  console.log(`開始時刻: ${data.startTime}`);
  console.log(`終了時刻: ${new Date().toISOString()}`);

  // テスト結果の簡易サマリー
  console.log("📊 テスト完了統計:");
  console.log(`- エラー率閾値: ${CONFIG.THRESHOLDS.stress.http_req_failed}`);
  console.log(`- 応答時間閾値: ${CONFIG.THRESHOLDS.stress.http_req_duration}`);
};
