# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## 開発コマンド

**コア開発:**
```bash
pnpm dev                   # 開発サーバーを起動
pnpm build                 # 本番用ビルド (Vercel)
pnpm build:node            # Node.js デプロイ用ビルド
pnpm preview               # 本番ビルドをローカルでプレビュー
pnpm check                 # Astro チェック + TypeScript 検証実行
```

**コード品質:**
```bash
pnpm lint                  # Biome でコードチェック
pnpm lint:fix              # 自動修正可能な Biome の問題を修正
```

**コンテンツ管理:**
```bash
pnpm create:entry          # インタラクティブなブログ記事作成スクリプト
pnpm release               # リリース自動化スクリプト
```

**ビルドプロセス:**
- `postbuild` はビルド後に自動的に Pagefind のインデックス作成を実行
- プレビューコマンドは `.env` から環境変数を読み込み

## アーキテクチャ概要

### コアフレームワーク
- **Astro 5.10.0** とインタラクティブ機能のための React islands
- **デュアルデプロイ戦略**: Vercel (デフォルト) または `--node` フラグによる Node.js スタンドアロン
- **TailwindCSS v4** と `@theme` ディレクティブを使用した CSS ファースト設定
- **TypeScript** 最厳格設定と `#/*` パスエイリアス（`./src/*` へ）

### 機能ベース構成
```
src/features/
├── blog/           # ブログ機能 (コンポーネント、アクション、ユーティリティ)
├── home/           # ホームページ Bento グリッドコンポーネント
└── legal/          # 法的ページ
```

**重要な原則**: 各機能は共有のグローバルフォルダではなく、独自のコンポーネント、ユーティリティ、設定を含む。

### コンテンツシステム
- **ファイルベース CMS** 厳密な Zod スキーマを持つ Astro Content Collections を使用
- **日付ベース構造**: `/content/blog/YYYY-MM-DD/index.mdx`
- **コロケーション資産**: 画像はコンテンツファイルと同じ場所に保存
- **カテゴリ-タグ検証**: タグは特定のカテゴリにスコープされ、ビルド時に検証
- **コンテンツライフサイクル**: 投稿は `draft`/`published` ステータスとリビジョン追跡を持つ

### 日本語サポート
日本語に特化したサイトで、以下の最適化を実装:
- **BudouX 統合** 自然な日本語改行のため
- **日本語タイポグラフィ** TailwindCSS で `palt` フォント機能
- **バイリンガルコンテンツ** (日本語ラベル、英語技術用語)

### カスタム Markdown 処理パイプライン
```
Remark plugins → Rehype plugins → Final HTML
```

**主要プラグイン** (すべて `/src/lib/` でカスタム構築):
- `remark-link-card`: 生の URL をリッチプレビューカードに変換
- `remark-video-block`: カスタム動画埋め込み構文
- `rehype-budoux`: 日本語テキスト処理
- `rehype-pagefind`: 検索インデックス統合

### API アーキテクチャ
- **Hono ベース API** `/api/[...path].ts` でキャッチオールルート
- **サービスモジュール** `/src/pages/api/_services/` 内:
  - GitHub 統合 (コントリビューション、ファイルメタデータ)
  - Spotify "現在再生中" ウィジェット
- **適切なキャッシュヘッダー** と型安全なレスポンス

### スタイリングシステム
- **TailwindCSS v4** テーマ用の CSS カスタムプロパティと
- **デザインシステム** `@theme` ディレクティブを使用して `global.css` で定義
- **ダークモード** `prefers-color-scheme` 経由
- **コンポーネント固有のスタイル** コンポーネントと同じ場所に配置

## 重要な開発パターン

### コンテンツ作成
- 新しいブログ投稿には `pnpm create:entry` を使用 - ディレクトリ作成、フロントマター生成、スラッグ作成を処理
- ブログ投稿に必要: title, description, emoji, category, publishedAt
- 画像はコンテンツファイルと同じディレクトリに配置

### コンポーネントパターン
- **Astro コンポーネント** 静的コンテンツとレイアウト用 (`.astro`)
- **React コンポーネント** インタラクティブ機能用 (`.tsx`)
- **共有 UI コンポーネント** `/src/components/ui/` 内
- **機能固有コンポーネント** 機能ディレクトリ内

### 環境設定
アプリは Astro の型付き環境変数を使用:
- サーバーシークレット (GitHub トークン、Spotify 認証情報、Redis)
- パブリック変数 (Vercel デプロイ情報)
- 環境条件付き動作 (画像最適化、デプロイメントアダプター)

### リント設定
- **Biome** カスタムルールでのフォーマットとリント
- 一般コードには**厳格なルール**、`.astro` ファイルには**緩和されたルール**
- スペースインデント、Git 統合有効

### 検索統合
- **Pagefind** ビルド時に自動的に検索インデックスを生成
- **カスタム rehype プラグイン** コンテンツに検索属性を追加
- JavaScript 不要でフロントエンドで検索利用可能

## 理解すべき重要ファイル

- `astro.config.ts` - 広範なプラグイン設定を持つ中央設定
- `src/content.config.ts` - コンテンツスキーマ定義と検証
- `src/features/blog/config/` - カテゴリとタグ定義
- `src/lib/` - カスタム markdown プラグインとユーティリティ
- `biome.json` - コード品質設定
- `src/styles/global.css` - デザインシステム定義

## テストと品質保証

- コミット前に `pnpm check` を実行して TypeScript と Astro を検証
- `pnpm lint:fix` を使用してコードを自動フォーマット
- コンテンツ検証は Zod スキーマ経由でビルド時に実行
- デプロイ前に `pnpm preview` でローカルでビルドをプレビュー
