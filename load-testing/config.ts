// 負荷テスト共通設定

export const CONFIG = {
  // 基本設定
  BASE_URL: __ENV.BASE_URL || "http://localhost:4321",

  // パフォーマンス閾値
  THRESHOLDS: {
    // 基本負荷テスト
    basic: {
      http_req_duration: ["p(95)<500"], // 95%のリクエストが500ms以内
      http_req_failed: ["rate<0.01"], // エラー率1%未満
    },

    // API負荷テスト（外部API依存のため緩和）
    api: {
      http_req_duration: ["p(95)<1000"], // 95%のリクエストが1秒以内
      http_req_failed: ["rate<0.05"], // エラー率5%未満
    },

    // ストレステスト
    stress: {
      http_req_duration: ["p(95)<2000"], // 95%のリクエストが2秒以内
      http_req_failed: ["rate<0.1"], // エラー率10%未満
    },
  },

  // テストシナリオ設定
  SCENARIOS: {
    // 通常負荷
    normal_load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 10 },
        { duration: "5m", target: 10 },
        { duration: "2m", target: 0 },
      ],
    },

    // 高負荷
    high_load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 50 },
        { duration: "10m", target: 50 },
        { duration: "2m", target: 0 },
      ],
    },

    // スパイクテスト
    spike_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 100 },
        { duration: "1m", target: 100 },
        { duration: "30s", target: 0 },
      ],
    },
  },

  // テスト対象URL
  URLS: {
    pages: ["/", "/blog", "/about", "/bucket-list"],

    api: ["/api/github/contributions", "/api/spotify"],

    // 実際のブログ記事ID（更新必要）
    blogPosts: [
      "/blog/posts/b1y4nft",
      "/blog/posts/b1fw2ts",
      "/blog/posts/b1rklfz",
    ],
  },

  // ユーザー行動パターン
  USER_BEHAVIOR: {
    // ページ閲覧時間（秒）
    view_time: {
      home: 3,
      blog_list: 2,
      blog_post: 8,
      other: 2,
    },

    // 行動確率
    probabilities: {
      view_additional_page: 0.3,
      read_blog_post: 0.7,
      navigate_to_about: 0.1,
    },
  },

  // モニタリング設定
  MONITORING: {
    // メトリクス収集間隔
    collection_interval: "5s",

    // アラート閾値
    alerts: {
      response_time_ms: 1000,
      error_rate_percent: 5,
      memory_usage_percent: 85,
    },
  },
};

// 環境別設定の上書き
if (__ENV.TEST_ENV === "production") {
  CONFIG.THRESHOLDS.basic.http_req_duration = ["p(95)<1000"];
  CONFIG.THRESHOLDS.api.http_req_failed = ["rate<0.02"];
}

if (__ENV.TEST_ENV === "staging") {
  CONFIG.THRESHOLDS.basic.http_req_duration = ["p(95)<800"];
}

export default CONFIG;
