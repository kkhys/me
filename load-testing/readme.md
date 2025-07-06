# 負荷テスト システム

k6を使用したブログサイトの包括的な負荷テストスイート

## 📁 ファイル構成

```
load-testing/
├── config.ts            # 共通設定（URL、閾値、シナリオ）
├── utils.ts             # ユーティリティ関数とヘルパー
├── basic-load-test.ts   # 基本負荷テスト（通常利用）
├── api-load-test.ts     # API負荷テスト（外部API）
├── stress-test.ts       # ストレステスト（極限負荷）
├── monitoring.ts        # 高度なモニタリング機能
└── readme.md            # このファイル
```

## 🚀 クイックスタート

### 前提条件

```bash
# k6のインストール
brew install k6

# または
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-macos-amd64.zip -L | tar xvs --strip-components 1
```

### 基本実行

```bash
# 基本負荷テスト（推奨）
pnpm load-test

# APIテスト
pnpm load-test:api

# ストレステスト
pnpm load-test:stress

# 全テスト実行
pnpm load-test:all
```

## 📊 テストタイプ

### 1. 基本負荷テスト (`basic-load-test.ts`)
**目的**: 通常利用時のパフォーマンス検証
- **負荷**: 10同時ユーザー × 9分
- **対象**: ホームページ、ブログ記事、静的ページ
- **閾値**: 95%ile < 500ms、エラー率 < 1%

**実行:**
```bash
k6 run load-testing/basic-load-test.ts
```

### 2. API負荷テスト (`api-load-test.ts`)
**目的**: API エンドポイントの安定性検証
- **負荷**: 5同時ユーザー × 5分
- **対象**: OG画像生成、エラーハンドリング
- **閾値**: 95%ile < 1000ms、エラー率 < 5%

**実行:**
```bash
k6 run load-testing/api-load-test.ts
```

**注意**: GitHub/Spotify APIテストはレート制限によりコメントアウト

### 3. ストレステスト (`stress-test.ts`)
**目的**: 極限負荷での動作確認
- **負荷**: 最大200同時ユーザー × 21分
- **パターン**: 段階的負荷増加 + スパイクテスト
- **閾値**: 95%ile < 2000ms、エラー率 < 10%

**実行:**
```bash
k6 run load-testing/stress-test.ts
```

## ⚙️ 設定

### 環境変数

```bash
# 基本設定
export BASE_URL="http://localhost:4321"   # テスト対象URL
export TEST_ENV="test"                    # 環境（test/staging/production）

# 監視設定（オプション）
export PUSHGATEWAY_URL="http://localhost:9091"
export PUSHGATEWAY_ENABLED="true"
```

### config.ts の主要設定

```typescript
// パフォーマンス閾値
THRESHOLDS: {
  basic: {
    http_req_duration: ["p(95)<500"],   // 基本テスト
    http_req_failed: ["rate<0.01"]
  },
  api: {
    http_req_duration: ["p(95)<1000"],  // APIテスト  
    http_req_failed: ["rate<0.05"]
  },
  stress: {
    http_req_duration: ["p(95)<2000"],  // ストレステスト
    http_req_failed: ["rate<0.1"]
  }
}

// ユーザー行動パターン
USER_BEHAVIOR: {
  probabilities: {
    read_blog_post: 0.7,              // ブログ記事閲覧率
    view_additional_page: 0.3         // 追加ページ閲覧率
  }
}
```

## 🔧 ユーティリティ機能

### utils.ts の主要機能

```typescript
// 基本チェック
basicChecks(response, "Homepage", 200, 1000)

// APIレスポンス検証
apiChecks(response, "API_Name", validatorFunction)

// 重み付きランダム選択
weightedRandom([
  { item: "/", weight: 5 },
  { item: "/blog", weight: 3 }
])

// リトライ機能
retryRequest(() => http.get(url), 3, 1)

// エラーログ
logError(response, url, "context")
```

### 高度な機能

- **重み付きURL選択**: 人気ページに高い重みを設定
- **リトライ機能**: サーバーエラー時の自動再試行
- **バリデーター**: API レスポンスの構造検証
- **カスタムメトリクス**: ビジネス指標の測定

## 📈 結果出力

### 基本出力
```bash
# コンソール出力（デフォルト）
k6 run load-testing/basic-load-test.ts

# JSON形式で保存
k6 run --out json=results.json load-testing/basic-load-test.ts

# CSV形式で保存
k6 run --out csv=results.csv load-testing/basic-load-test.ts
```

### 詳細監視（monitoring.ts）

```typescript
import { metricsCollector } from "./monitoring.ts";

// HTTPリクエストの詳細記録
metricsCollector.recordHttpRequest(response, "/api/test", "operation");

// パフォーマンス警告チェック
metricsCollector.checkPerformanceThresholds(response, "/slow-page");

// テスト完了時のサマリー
metricsCollector.printSummary();
```

## 🎯 実際のユースケース

### 開発時のテスト
```bash
# 新機能のパフォーマンス確認
BASE_URL="http://localhost:4321" pnpm load-test
```

### デプロイ前テスト
```bash
# ステージング環境での確認
BASE_URL="https://staging.example.com" pnpm load-test:all
```

### 本番環境監視
```bash
# 本番環境の定期チェック
BASE_URL="https://example.com" TEST_ENV="production" pnpm load-test
```

## 🚨 トラブルシューティング

### よくあるエラー

**1. モジュールが見つからない**
```
ERRO[0000] GoError: The moduleSpecifier "./config" couldn't be found
```
**解決**: ファイル拡張子を明示 `import CONFIG from "./config.ts"`

**2. InfluxDB接続エラー**
```
ERRO[0009] Couldn't write stats ... connection refused
```
**解決**: InfluxDBなしで実行 `k6 run load-testing/basic-load-test.ts`

**3. タイムアウトエラー**
```
ERRO[0030] Request timeout
```
**解決**: `config.ts`で`timeout`設定を調整

### デバッグ方法

```bash
# 詳細ログ出力
k6 run --verbose load-testing/basic-load-test.ts

# HTTPトレースログ
k6 run --http-debug="full" load-testing/basic-load-test.ts

# VU数を減らして確認
k6 run --vus=1 --duration=1m load-testing/basic-load-test.ts
```

## 📚 参考リンク

- [k6 公式ドキュメント](https://k6.io/docs/)

## 🔄 継続的改善

このテストスイートは以下の改善を継続中：

- [ ] GitHub Actions ワークフロー統合
- [ ] APIテストの外部依存解決
- [ ] Grafana ダッシュボード構築
- [ ] パフォーマンス回帰テスト自動化
- [ ] 詳細レポート機能追加

---

**💡 ヒント**: 初回実行は`pnpm load-test`から始めることを推奨します。
