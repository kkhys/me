// 負荷テスト用モニタリング設定

import { Counter, Gauge, Rate, Trend } from "k6/metrics";
import CONFIG from "./config.ts";
import type { K6Response } from "./utils.ts";

export const customMetrics = {
  // エラー統計
  httpErrors: new Counter("http_errors_total"),
  apiErrors: new Counter("api_errors_total"),
  serverErrors: new Counter("server_errors_total"),

  // レスポンス時間
  pageLoadTime: new Trend("page_load_time"),
  apiResponseTime: new Trend("api_response_time"),
  dbQueryTime: new Trend("db_query_time"),

  // スループット
  requestsPerSecond: new Rate("requests_per_second"),
  successfulRequests: new Counter("successful_requests_total"),

  // リソース使用量
  memoryUsage: new Gauge("memory_usage_bytes"),
  cpuUsage: new Gauge("cpu_usage_percent"),

  // ビジネスメトリクス
  blogViewsTotal: new Counter("blog_views_total"),
  apiCallsTotal: new Counter("api_calls_total"),
  imageGenerationsTotal: new Counter("image_generations_total"),
};

// メトリクス記録用ヘルパー関数
export class MetricsCollector {
  private readonly startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * HTTPリクエストのメトリクスを記録
   */
  recordHttpRequest(
    response: K6Response,
    endpoint: string,
    operation = "unknown",
  ): void {
    const duration = response.timings.duration;
    const isError = response.status >= 400;
    const isServerError = response.status >= 500;

    // 基本メトリクス
    customMetrics.requestsPerSecond.add(1);

    if (isError) {
      customMetrics.httpErrors.add(1, { endpoint, operation });
    } else {
      customMetrics.successfulRequests.add(1, { endpoint, operation });
    }

    if (isServerError) {
      customMetrics.serverErrors.add(1, { endpoint, operation });
    }

    // レスポンス時間（CONFIG使用）
    if (endpoint.startsWith("/api/")) {
      customMetrics.apiResponseTime.add(duration, { endpoint, operation });
      customMetrics.apiErrors.add(isError ? 1 : 0, { endpoint });
      customMetrics.apiCallsTotal.add(1, { endpoint });
    } else {
      customMetrics.pageLoadTime.add(duration, { endpoint, operation });
    }

    // ビジネスメトリクス（CONFIG使用）
    if (CONFIG.URLS.blogPosts.some((post) => endpoint.includes(post))) {
      customMetrics.blogViewsTotal.add(1);
    }

    if (endpoint.includes("/api/og/")) {
      customMetrics.imageGenerationsTotal.add(1);
    }
  }

  /**
   * パフォーマンス警告をログ出力（CONFIG使用）
   */
  checkPerformanceThresholds(response: K6Response, endpoint: string): void {
    const duration = response.timings.duration;
    const alerts = CONFIG.MONITORING.alerts;

    if (duration > alerts.response_time_ms * 2) {
      console.warn(`🐌 非常に遅いレスポンス: ${duration}ms - ${endpoint}`);
    } else if (duration > alerts.response_time_ms) {
      console.warn(`⏱️  遅いレスポンス: ${duration}ms - ${endpoint}`);
    }

    if (response.status >= 400) {
      console.error(`❌ エラーレスポンス: ${response.status} - ${endpoint}`);

      // 詳細エラー情報
      if (response.status >= 500) {
        const bodyText = typeof response.body === "string" ? response.body : "";
        console.error(`   サーバーエラー詳細: ${bodyText.substring(0, 200)}`);
      }
    }
  }

  /**
   * 定期的なシステムメトリクス収集（CONFIG使用）
   */
  collectSystemMetrics(): void {
    // 実際の本番環境では、システムメトリクスを収集
    // ここではダミーデータを使用
    const memoryUsage = Math.random() * 1000000000; // バイト単位
    const cpuUsage = Math.random() * 100; // パーセント

    customMetrics.memoryUsage.add(memoryUsage);
    customMetrics.cpuUsage.add(cpuUsage);

    const alerts = CONFIG.MONITORING.alerts;

    // リソース使用量の警告（CONFIG使用）
    if (cpuUsage > alerts.memory_usage_percent) {
      console.warn(`⚠️  高CPU使用率: ${cpuUsage.toFixed(1)}%`);
    }

    if (memoryUsage > 800000000) {
      // 800MB
      console.warn(
        `⚠️  高メモリ使用量: ${(memoryUsage / 1000000).toFixed(1)}MB`,
      );
    }
  }

  /**
   * テスト実行統計の出力（CONFIG使用）
   */
  printSummary(): void {
    const duration = (Date.now() - this.startTime) / 1000;
    console.log("\n📊 テスト実行サマリー:");
    console.log(`   実行時間: ${duration.toFixed(1)}秒`);
    console.log(`   VU: ${__VU}, 反復: ${__ITER}`);
    console.log(`   収集間隔: ${CONFIG.MONITORING.collection_interval}`);
    console.log(`   環境: ${__ENV.TEST_ENV || "test"}`);
  }

  /**
   * アラート閾値チェック（CONFIG使用）
   */
  checkAlerts(metrics: TestResultData): string[] {
    const alerts: string[] = [];
    const config = CONFIG.MONITORING.alerts;

    if (metrics.errorRate && metrics.errorRate > config.error_rate_percent) {
      alerts.push(
        `エラー率が閾値を超過: ${metrics.errorRate}% > ${config.error_rate_percent}%`,
      );
    }

    if (
      metrics.p95ResponseTime &&
      metrics.p95ResponseTime > config.response_time_ms
    ) {
      alerts.push(
        `P95応答時間が閾値を超過: ${metrics.p95ResponseTime}ms > ${config.response_time_ms}ms`,
      );
    }

    return alerts;
  }
}

// グローバルメトリクスコレクター
export const metricsCollector = new MetricsCollector();

/**
 * アラート設定（CONFIG統合）
 */
export const alertThresholds = {
  // CONFIG.MONITORINGから基本設定を取得
  ...CONFIG.MONITORING.alerts,

  // 追加の設定
  api_response_time_p95: 500,
  api_error_rate_percent: 2,
  min_successful_requests: 100,
} as const;

/**
 * Grafana/Prometheus向けのメトリクスエクスポート設定（CONFIG統合）
 */
export const monitoringConfig = {
  // CONFIG.MONITORINGから設定を取得
  scrapeInterval: CONFIG.MONITORING.collection_interval,

  // ラベル設定
  defaultLabels: {
    environment: __ENV.TEST_ENV || "test",
    service: "blog-site",
    version: __ENV.VERSION || "unknown",
  },

  // Prometheus pushgateway（オプション）
  pushgateway: {
    url: __ENV.PUSHGATEWAY_URL || "http://localhost:9091",
    enabled: __ENV.PUSHGATEWAY_ENABLED === "true",
  },

  // Grafana dashboard用のクエリ例
  grafanaQueries: {
    responseTime:
      "histogram_quantile(0.95, rate(http_req_duration_bucket[5m]))",
    errorRate:
      "rate(http_errors_total[5m]) / rate(http_requests_total[5m]) * 100",
    throughput: "rate(http_requests_total[5m])",
  },
} as const;

// テスト結果データの型定義
interface TestResultData {
  duration?: number;
  requests?: number;
  successful?: number;
  failed?: number;
  errorRate?: number;
  avgResponseTime?: number;
  p95ResponseTime?: number;
  p99ResponseTime?: number;
  rps?: number;
  peakRps?: number;
  alerts?: string[];
  recommendations?: string[];
}

// フォーマットされたテスト結果の型定義
interface FormattedTestResult {
  timestamp: string;
  testType: string;
  environment: string;
  duration: number;
  metrics: {
    requests: {
      total: number;
      successful: number;
      failed: number;
      errorRate: number;
    };
    performance: {
      avgResponseTime: number;
      p95ResponseTime: number;
      p99ResponseTime: number;
    };
    throughput: {
      requestsPerSecond: number;
      peakRps: number;
    };
  };
  alerts: string[];
  recommendations: string[];
  config: {
    baseUrl: string;
    thresholds: typeof CONFIG.MONITORING.alerts;
  };
}

/**
 * テスト結果のJSON出力用フォーマッター（CONFIG統合）
 */
export const formatTestResults = (
  data: TestResultData,
): FormattedTestResult => {
  return {
    timestamp: new Date().toISOString(),
    testType: __ENV.TEST_TYPE || "unknown",
    environment: __ENV.TEST_ENV || "test",
    duration: data.duration || 0,
    metrics: {
      requests: {
        total: data.requests || 0,
        successful: data.successful || 0,
        failed: data.failed || 0,
        errorRate: data.errorRate || 0,
      },
      performance: {
        avgResponseTime: data.avgResponseTime || 0,
        p95ResponseTime: data.p95ResponseTime || 0,
        p99ResponseTime: data.p99ResponseTime || 0,
      },
      throughput: {
        requestsPerSecond: data.rps || 0,
        peakRps: data.peakRps || 0,
      },
    },
    alerts: data.alerts || [],
    recommendations: data.recommendations || [],
    config: {
      baseUrl: CONFIG.BASE_URL,
      thresholds: CONFIG.MONITORING.alerts,
    },
  };
};
