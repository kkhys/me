# セットアップ

認証不要の8ソース (Hacker News, Lobsters, Reddit, GitHub Trending, Techmeme,
はてなブックマーク, Zenn, Qiita) のみで動作する。追加設定なしで使い始められる。

dev.to と Hugging Face Daily Papers は 2026-09-05 に対象から外した。fetcher
は残してあり、config.json の `disabled_sources` (既定で `devto`, `hfpapers`)
で無効化しているだけなので、復活させるには該当 id を外せばよい。無効化した
ソースは raw.json に一切現れない (skipped 扱いにもならない)。

## 製品アップデート

トレンド 8 ソースとは別に、7 製品のリリースノートを market `updates` の
サービスとして取得する (fetch_trends.py の `UPDATE_PRODUCTS`)。認証不要。

| id                 | フィード                                                                                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claude`           | GitHub Releases `anthropics/claude-code` / Claude Platform release notes (platform.claude.com の `.md`) / Claude Apps release notes (support.claude.com の HTML)        |
| `openai`           | GitHub Releases `openai/codex` (prerelease の alpha は除外) / ChatGPT & Codex changelog RSS (developers.openai.com) / OpenAI News RSS のうち category が Product のもの |
| `devin`            | docs.devin.ai の release notes RSS (1 日分が 1 エントリ)                                                                                                                |
| `cursor`           | cursor.com/changelog RSS / forum.cursor.com の Announcements カテゴリ RSS (Grok Bot やモデル提供の告知はここに出る)                                                     |
| `github_changelog` | github.blog/changelog RSS (10 件/ページなので最大 4 ページ読む。Copilot を含む)                                                                                         |
| `orca`             | GitHub Releases `stablyai/orca` (prerelease のモバイル版は除外)                                                                                                         |
| `slack`            | ヘルプセンター「Slack updates and changes」(en-gb の HTML。日付は月単位なので `published_at` は null) / docs.slack.dev/changelog RSS                                    |

- エントリは公開日 (ローカル日付、`day`) のダイジェストに載る。
  `updates_window_days` (既定 7) 以内に公開されたエントリを取り、`site_repo`
  の run ファイルの `updates` に既に載っている URL は落とす (seen.json は
  使わない。掲載済みかどうかの記録は run ファイルそのもの)。前日の遅い
  時間に出たエントリは翌日の実行で前日のファイルに追記される。日付のない
  エントリ (Slack のヘルプページ) は実行日に載る。
- 製品内の一部フィードが失敗しても、他が取れていれば `status: ok` で note に
  `取得失敗: ...` が付く。全フィード失敗で `error`。
- 対象外: anthropic.com/news (RSS がなく、モデル発表は Claude Apps release
  notes に載る)、x.ai/news (スクリプトの UA は 403)。Grok Bot は Cursor の
  フォーラム告知で拾う。
- `GITHUB_TOKEN` があれば GitHub API のレート制限 (未認証 60 回/時) に余裕が
  出る。1 回の実行で使うのは 3 回。
- バックフィル (`--date`) では全製品 `skipped`。

## Qiita トークン (任意)

未認証だと IP あたり 60リクエスト/時。1回の実行で最大26リクエスト使うため、
同一時間内に何度も実行するなら
https://qiita.com/settings/applications で read_qiita スコープのトークンを
発行し `QIITA_ACCESS_TOKEN` に設定すると 1000/時 になる。

## Reddit について

Reddit Data API (JSON) はアプリ作成が Responsible Builder Policy への同意・
承認制でゲートされているため使わず、認証不要で公式提供されている RSS
(`/r/<sub>/top/.rss?t=day` と記事単位の `.rss`) から取得している。対象
subreddit は config.json の `subreddits` (デフォルト `["programming"]`) で
変更できる。RSS にはスコアが載らないため、順位は Reddit 自身の top
ランキング順をそのまま使う。コメント取得はバースト時に 429 が返ることが
あり、リトライしても失敗した記事は discussion_summary なしで載る
(ベストエフォート)。

## X (Twitter) について

公式 X API は読み取りが実質有料 (Basic $200/月〜) のため組み込んでいない。
代替は xAI (Grok) API の Live Search で、`XAI_API_KEY` があれば X 上の話題を
検索できる (従量課金)。追加する場合は `fetch_trends.py` に xAI の
chat completions + search_parameters を使う fetcher を足し、`SERVICES` に
登録するだけでよい構造にしてある。

## 状態ファイル

`~/.claude/trend-digest/`:

| ファイル       | 役割                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `profile.md`   | 興味プロフィール。フィードバックで育つ                                                                                                 |
| `config.json`  | ソース設定 (hatena_categories, subreddits, 表示件数, comments_top_n, updates_window_days など) と `site_repo` (公開先リポジトリのパス) |
| `seen.json`    | 既出URL履歴 (「既出」バッジ用、自動管理)                                                                                               |
| `runs/<date>/` | raw.json (取得結果)                                                                                                                    |

## 公開

完成した digest は me リポジトリの `apps/trends/src/content/runs/<date>.json`
にコミットされ、`pnpm deploy:trends` で trends.kkhys.me にデプロイされる。
JSON のスキーマ検証は同リポジトリの `apps/trends/src/content.config.ts`
(zod) がビルド時に行う。ローカルプレビューは me リポジトリで
`pnpm dev:trends`。
