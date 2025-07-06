// 負荷テスト用ユーティリティ関数

import { check, sleep } from "k6";

/**
 * k6のHTTPレスポンス型
 */
export interface K6Response {
  status: number;
  body: string | ArrayBuffer | null;
  headers: Record<string, string>;
  timings: {
    blocked: number;
    connecting: number;
    tls_handshaking: number;
    sending: number;
    waiting: number;
    receiving: number;
    duration: number;
  };
}

/**
 * 重み付きアイテムの型
 */
interface WeightedItem<T> {
  item: T;
  weight: number;
}

/**
 * カスタムメトリクスの型
 */
interface CustomMetrics {
  responseTime?: {
    add: (value: number, tags?: Record<string, string>) => void;
  };
  errorRate?: {
    add: (value: number, tags?: Record<string, string>) => void;
  };
  requestCount?: {
    add: (value: number, tags?: Record<string, string>) => void;
  };
}

/**
 * テストデータの型
 */
interface TestData {
  startTime?: string;
  [key: string]: unknown;
}

/**
 * Spotify APIレスポンスの型
 */
interface SpotifyResponse {
  isPlaying: boolean;
  title: string;
  artist: string;
  [key: string]: unknown;
}

/**
 * リクエスト関数の型
 */
type RequestFunction = () => K6Response;

/**
 * レスポンスの基本チェックを実行
 * @param response - HTTPレスポンス
 * @param name - チェック名
 * @param expectedStatus - 期待するステータスコード
 * @param maxDuration - 最大応答時間（ms）
 */
export const basicChecks = (
  response: K6Response,
  name: string,
  expectedStatus = 200,
  maxDuration = 1000,
): boolean => {
  const statusKey = `${name}: status_${expectedStatus}`;
  const durationKey = `${name}: duration_under_${maxDuration}ms`;
  const sizeKey = `${name}: response_size_valid`;

  return check(response, {
    [statusKey]: (r) => r.status === expectedStatus,
    [durationKey]: (r) => r.timings.duration < maxDuration,
    [sizeKey]: (r) => typeof r.body === "string" && r.body.length > 0,
  });
};

/**
 * APIレスポンスの詳細チェック
 * @param response - HTTPレスポンス
 * @param name - API名
 * @param validator - レスポンスボディのバリデーター関数
 */
export const apiChecks = (
  response: K6Response,
  name: string,
  validator?: (data: unknown) => boolean,
): boolean => {
  const successKey = `${name}: success_response`;
  const jsonKey = `${name}: json_response`;
  const cacheKey = `${name}: cache_header_exists`;
  const validationKey = `${name}: response_format_valid`;

  const checks: Record<string, (r: K6Response) => boolean> = {
    [successKey]: (r) => r.status === 200,
    [jsonKey]: (r) =>
      r.headers["Content-Type"]?.includes("application/json") ?? false,
    [cacheKey]: (r) => r.headers["Cache-Control"] !== undefined,
  };

  if (validator) {
    checks[validationKey] = (r) => {
      try {
        if (typeof r.body !== "string") {
          return false;
        }
        const data: unknown = JSON.parse(r.body);
        return validator(data);
      } catch {
        return false;
      }
    };
  }

  return check(response, checks);
};

/**
 * ランダムな待機時間を生成
 * @param min - 最小時間（秒）
 * @param max - 最大時間（秒）
 */
export const randomSleep = (min = 1, max = 3) => {
  return Math.random() * (max - min) + min;
};

/**
 * 重み付きランダム選択
 * @param items - アイテムと重みの配列 [{item: 'a', weight: 0.7}, ...]
 */
export const weightedRandom = <T>(items: WeightedItem<T>[]) => {
  if (items.length === 0) {
    throw new Error("Items array cannot be empty");
  }

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.item;
    }
  }

  const lastItem = items[items.length - 1];
  if (!lastItem) {
    throw new Error("Unable to find last item in array");
  }
  return lastItem.item;
};

/**
 * ユーザーエージェント文字列を生成
 * @param testName - テスト名
 */
export const generateUserAgent = (testName = "k6-test") => {
  const browsers = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  ];

  const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
  return `${randomBrowser} ${testName}/${__VU}`;
};

/**
 * エラーログ記録
 * @param response - HTTPレスポンス
 * @param url - リクエストURL
 * @param context - エラーコンテキスト
 */
export const logError = (response: K6Response, url: string, context = "") => {
  if (response.status >= 400) {
    console.log(`❌ エラー [${context}]: ${response.status} ${url}`);
    if (response.status >= 500) {
      const bodyText = typeof response.body === "string" ? response.body : "";
      console.log(`   サーバーエラー詳細: ${bodyText.substring(0, 200)}`);
    }
  }

  if (response.timings.duration > 5000) {
    console.log(
      `⏱️  遅延警告 [${context}]: ${response.timings.duration}ms ${url}`,
    );
  }
};

/**
 * パフォーマンスメトリクスの記録
 * @param response - HTTPレスポンス
 * @param metrics - カスタムメトリクスオブジェクト
 * @param operation - 操作名
 */
export const recordMetrics = (
  response: K6Response,
  metrics: CustomMetrics,
  operation: string,
) => {
  if (metrics.responseTime) {
    metrics.responseTime.add(response.timings.duration, { operation });
  }

  if (metrics.errorRate) {
    metrics.errorRate.add(response.status >= 400 ? 1 : 0, { operation });
  }

  if (metrics.requestCount) {
    metrics.requestCount.add(1, { operation });
  }
};

/**
 * テスト実行統計の表示
 * @param data - テストセットアップデータ
 */
export const printTestStats = (data: TestData) => {
  console.log("📊 テスト統計:");
  console.log(`   開始時刻: ${data.startTime || new Date().toISOString()}`);
  console.log(`   VU数: ${__VU}`);
  console.log(`   反復回数: ${__ITER}`);
};

/**
 * Spotify APIレスポンスのバリデーター
 * @param data - Spotify APIレスポンス
 */
export const validateSpotifyResponse = (
  data: unknown,
): data is SpotifyResponse => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return (
    typeof obj.isPlaying === "boolean" &&
    typeof obj.title === "string" &&
    typeof obj.artist === "string"
  );
};

/**
 * GitHub APIレスポンスのバリデーター
 * @param data - GitHub APIレスポンス
 */
export const validateGithubResponse = (data: unknown) => {
  return Array.isArray(data) || (data !== null && typeof data === "object");
};

/**
 * リトライ機能付きHTTPリクエスト
 * @param requestFn - リクエスト関数
 * @param maxRetries - 最大リトライ回数
 * @param retryDelay - リトライ間隔（秒）
 */
export const retryRequest = (
  requestFn: RequestFunction,
  maxRetries = 3,
  retryDelay = 1,
) => {
  let lastResponse: K6Response | undefined;

  for (let i = 0; i <= maxRetries; i++) {
    lastResponse = requestFn();

    if (lastResponse.status < 500) {
      return lastResponse; // 成功またはクライアントエラー
    }

    if (i < maxRetries) {
      console.log(`🔄 リトライ ${i + 1}/${maxRetries}: ${lastResponse.status}`);
      sleep(retryDelay);
    }
  }

  // この時点で lastResponse は必ず定義されている
  if (!lastResponse) {
    throw new Error("Request function did not return a response");
  }
  return lastResponse;
};
