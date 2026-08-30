/* Conventions recovered from the apps' own CSS and templates — patterns
   that recur across two or more apps (or the shared packages) but were
   never written down. Rendered by pages/conventions.astro. Line numbers
   point at main; re-check them when the cited file changes. */

export interface Evidence {
  /** Repo-relative path. */
  path: string;
  line: number;
}

export interface Convention {
  /** The rule in one line. */
  rule: string;
  /** Why / how, in one or two sentences. */
  detail?: string | undefined;
  /** Concrete values the rule fixes (durations, offsets, selectors). */
  values?: string[] | undefined;
  /** Where the rule is visible; needs two or more apps or a shared package. */
  evidence: Evidence[];
  /** Known departures from the rule and where they are. */
  deviation?: string | undefined;
}

export interface ConventionGroup {
  id: string;
  title: string;
  items: Convention[];
}

const REPO = "https://github.com/kkhys/me/blob/main";

export const sourceUrl = (path: string, line: number) => `${REPO}/${path}#L${line}`;

export const at = (path: string, line: number): Evidence => ({ path, line });

export const CONVENTION_GROUPS: ConventionGroup[] = [
  {
    id: "motion",
    title: "Motion",
    items: [
      {
        rule: "transition の duration は 0.15s か 0.2s の二値。easing は書かない(既定の ease)",
        detail:
          "色・背景色の変化は 0.2s、アイコンや戻るボタンなど小さな chrome は 0.15s。0.18s や 0.1s は例外扱い。",
        values: ["color 0.2s", "background-color 0.2s", "transform 0.15s ease"],
        evidence: [
          at("packages/styles/components.css", 15),
          at("packages/ui/src/site-header.astro", 89),
          at("apps/me/src/components/ui/site-nav.astro", 127),
          at("apps/memo/src/components/social-icon.astro", 36),
          at("apps/trends/src/components/source-toc.astro", 120),
        ],
      },
      {
        rule: "blur-up の解除は例外なく filter 250ms ease-in-out",
        detail:
          "5 アプリと共有パッケージで同一の値。プレースホルダは幅 20px、ぼかしは blur(36px)。",
        values: ["transition: filter 250ms ease-in-out", "filter: blur(36px)", "width: 20"],
        evidence: [
          at("packages/ui/src/link-card.astro", 222),
          at("apps/me/src/components/ui/image/image.astro", 128),
          at("packages/ui/src/blur-image.astro", 88),
          at("apps/lgtm/src/pages/[...page].astro", 237),
        ],
      },
      {
        rule: ":active は押し込みのスケール。要素が大きいほど縮小率は小さい",
        detail: "カード 0.99、タイルやチップ 0.98、ボタン 0.95、アイコンボタン 0.9。",
        values: ["scale(0.99)", "scale(0.98)", "scale(0.95)", "scale(0.9)"],
        evidence: [
          at("packages/styles/components.css", 33),
          at("packages/ui/src/link-card.astro", 118),
          at("apps/me/src/features/blog/components/ui/blocks/memo-card.astro", 155),
          at("apps/me/src/features/blog/components/ui/tag-cloud.astro", 59),
          at("apps/lgtm/src/pages/[...page].astro", 166),
          at("apps/lgtm/src/pages/[id].astro", 238),
        ],
      },
      {
        rule: "hover は彩度ではなく明度で示す。--c-sub から --c-text へ",
        detail:
          "opacity を下げる hover は使わない。既定色が --c-text のブランドリンク(共有ヘッダーのタイトル)は逆向きに --c-sub へ、画像(memo のアバター)は outline を --c-border から --c-sub へ。",
        values: ["color: var(--c-sub)", "&:hover { color: var(--c-text) }"],
        evidence: [
          at("apps/me/src/components/ui/site-nav.astro", 131),
          at("apps/me/src/components/ui/site-footer.astro", 86),
          at("apps/trends/src/components/site-header.astro", 45),
          at("apps/art/src/components/pager.astro", 43),
          at("apps/memo/src/components/social-icon.astro", 39),
        ],
      },
      {
        rule: "リスト行・カードの hover 背景は --c-surface の 50% 透過で固定",
        detail:
          "8 箇所で完全一致。ベタ塗りの --c-surface はメニュー項目など「明確に選択する」要素だけに使う。",
        values: ["background-color: oklch(from var(--c-surface) l c h / 50%)"],
        evidence: [
          at("packages/ui/src/link-card.astro", 134),
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 109),
          at("apps/me/src/features/blog/components/ui/blocks/memo-card.astro", 169),
          at("apps/memo/src/features/search/components/search-dialog.astro", 46),
          at("apps/trends/src/pages/archive.astro", 74),
        ],
      },
      {
        rule: "popover / dialog の開閉は入り口と出口の両端を必ず対で宣言する",
        detail:
          "@starting-style と :not([open]) / :not(:popover-open) を組にし、display と overlay を allow-discrete で 0.2s。移動量は popover 4px、dialog 8px。",
        values: [
          "@starting-style",
          "transition-behavior: allow-discrete",
          "translate: 0 4px",
          "translate: 0 8px",
        ],
        evidence: [
          at("packages/search/src/dialog.astro", 88),
          at("apps/me/src/components/ui/site-nav.astro", 205),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 233),
        ],
      },
      {
        rule: "ループするアニメーションはスピナーの回転だけ",
        detail: "1s linear infinite。装飾目的の無限アニメーションは持たない。",
        values: ["animation: spin 1s linear infinite"],
        evidence: [at("packages/ui/src/spinner.astro", 35)],
      },
      {
        rule: "スクロール駆動アニメーションは端フェードのマスクにだけ使う",
        detail: "時間ベースの演出には使わない。横スクロールするテーブルとカテゴリナビの 2 箇所。",
        evidence: [
          at("apps/me/src/styles/prose.css", 200),
          at("apps/me/src/features/blog/components/ui/category-navigation.astro", 42),
        ],
      },
      {
        rule: "prefers-reduced-motion では transition を潰し、animation-duration は触らない",
        detail:
          "共有 base.css で一括。唯一の @keyframes はスクロール駆動のマスクなので animation は残す。装飾アニメは局所で opt-in する(art の view transition)。",
        values: ["transition-duration: 0.01ms !important", "scroll-behavior: auto !important"],
        evidence: [
          at("packages/styles/base.css", 79),
          at("apps/art/src/layouts/base-layout.astro", 30),
          at("apps/art/src/layouts/base-layout.astro", 30),
        ],
      },
    ],
  },
  {
    id: "links",
    title: "Links",
    items: [
      {
        rule: "chrome(ナビ・フッター・メタ)のリンクは既定で下線なし。hover で下線か色変化",
        values: ["a { color: inherit; text-decoration: none }"],
        evidence: [
          at("packages/ui/src/site-footer.astro", 67),
          at("apps/trends/src/styles/global.css", 26),
          at("apps/me/src/components/ui/site-brand.astro", 33),
          at("apps/memo/src/components/tag-link.astro", 21),
        ],
      },
      {
        rule: "本文リンクは色付き + text-underline-offset。下線の太さは 1px",
        detail: "prose は --c-link、トップページは本文色のまま下線色だけ --c-sub の 50% に落とす。",
        values: ["text-decoration-thickness: 1px", "text-underline-offset: 4px"],
        evidence: [
          at("apps/me/src/styles/prose.css", 103),
          at("apps/me/src/pages/index.astro", 54),
        ],
      },
      {
        rule: "外部リンクは target=_blank + rel=noreferrer",
        detail: "noreferrer は noopener を含意するので、rel はこの一語で足りる。",
        values: ['target="_blank" rel="noreferrer"'],
        evidence: [
          at("packages/ui/src/site-footer.astro", 31),
          at("apps/me/src/components/ui/site-nav.astro", 19),
          at("apps/trends/src/components/item-row.astro", 34),
          at("apps/memo/src/components/social-icon.astro", 15),
        ],
      },
      {
        rule: "visited 色を変えるのは prose 本文だけ",
        detail:
          "--c-link-visited の利用箇所は prose.css のみ。それ以外は visited でも色を据え置く。",
        values: ["--c-link-visited"],
        evidence: [
          at("packages/styles/tokens.css", 55),
          at("apps/me/src/styles/prose.css", 114),
          at("apps/me/src/pages/index.astro", 73),
        ],
      },
      {
        rule: "外部リンクは末尾に move-up-right アイコンをインラインで添える",
        detail: "0.625〜0.75rem、vertical-align -0.05em。",
        values: ["width: 0.625rem", "vertical-align: -0.05em"],
        evidence: [
          at("apps/me/src/components/ui/site-nav.astro", 140),
          at("apps/me/src/components/ui/site-footer.astro", 90),
          at("apps/me/src/pages/index.astro", 65),
        ],
      },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    items: [
      {
        rule: "見出しは共有 base で palt + text-wrap: balance。本文側の palt は .palt で明示付与",
        values: ['font-feature-settings: "palt"', "text-wrap: balance", ".palt"],
        evidence: [
          at("packages/styles/base.css", 47),
          at("packages/styles/base.css", 62),
          at("apps/me/src/layouts/blog-layout.astro", 119),
          at("apps/trends/src/components/item-row.astro", 33),
        ],
      },
      {
        rule: "文字サイズは小さい側に寄せる。本文は --fs-sm、--fs-base 以上は滅多に使わない",
        detail:
          "--fs-xs 約 60 箇所、--fs-sm 約 43 箇所、--fs-2xs 約 24 箇所に対し、--fs-base 以上は 5 箇所。",
        values: ["--fs-sm", "--fs-xs", "--fs-2xs"],
        evidence: [
          at("packages/styles/tokens.css", 6),
          at("apps/me/src/styles/prose.css", 2),
          at("apps/memo/src/components/thread-post.astro", 211),
        ],
      },
      {
        rule: "数字が並ぶ箇所は tabular-nums を付ける",
        detail: "日付・件数・ランク・年号・ページ番号。全アプリに分布。日付の書式は YYYY.MM.DD。",
        values: ["font-variant-numeric: tabular-nums", "YYYY.MM.DD"],
        evidence: [
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 129),
          at("apps/memo/src/components/post-header.astro", 74),
          at("apps/trends/src/components/item-row.astro", 100),
          at("apps/art/src/components/work-figure.astro", 66),
          at("apps/diary/src/components/diary-image.astro", 64),
          at("apps/lgtm/src/components/legal-layout.astro", 104),
        ],
      },
      {
        rule: "日付・キャプション・ページャの数値・トークン名は --font-mono",
        values: ["font-family: var(--font-mono)"],
        evidence: [
          at("packages/styles/tokens.css", 36),
          at("apps/art/src/components/gallery-thumb.astro", 53),
          at("apps/diary/src/components/diary-image.astro", 62),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 154),
        ],
      },
      {
        rule: "日本語の改行は BudouX。CSS 側は .budoux の 2 プロパティだけ",
        detail: "<Budoux> でラップするか、me のように rehype で本文へ自動適用する。",
        values: ["word-break: keep-all", "overflow-wrap: anywhere"],
        evidence: [
          at("packages/styles/base.css", 57),
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 37),
          at("apps/trends/src/components/digest-hero.astro", 14),
          at("apps/me/src/lib/rehype-budoux.ts", 1),
        ],
      },
      {
        rule: "text-wrap: pretty は使わない",
        detail: "長い CJK 本文で Chrome のレンダラが落ちるため、prose では明示的に回避している。",
        evidence: [at("apps/me/src/styles/prose.css", 11)],
      },
      {
        rule: "letter-spacing は原則 0。例外は mono キャプションの 0.02em",
        values: ["letter-spacing: 0.02em"],
        evidence: [
          at("apps/art/src/components/gallery-thumb.astro", 55),
          at("apps/art/src/components/work-figure.astro", 54),
          at("apps/diary/src/components/diary-image.astro", 68),
        ],
      },
      {
        rule: "行送りは UI が --lh-sm、読み物が --lh-base、prose 本文だけ 2",
        values: ["--lh-sm: 1.5", "--lh-base: 1.75", "line-height: 2"],
        evidence: [
          at("packages/styles/tokens.css", 18),
          at("apps/memo/src/styles/global.css", 21),
          at("apps/me/src/styles/prose.css", 17),
        ],
      },
    ],
  },
  {
    id: "layout",
    title: "Spacing & shell",
    items: [
      {
        rule: "body グリッドの行名は [top] auto [main-start] 1fr [main-end] auto [bottom]",
        detail: "共有ヘッダー・フッターはこの行名に自分を配置する。",
        values: ["grid-template-rows: [top] auto [main-start] 1fr [main-end] auto [bottom]"],
        evidence: [
          at("apps/memo/src/styles/global.css", 30),
          at("apps/lgtm/src/styles/global.css", 32),
          at("packages/ui/src/site-header.astro", 63),
          at("packages/ui/src/site-footer.astro", 45),
        ],
      },
      {
        rule: "本文カラムは 640px 未満で padding-inline 1rem、640px 以上で 0",
        detail: "42rem をフルに使う。",
        values: ["padding-inline: 1rem", "@media (width >= 640px) { padding-inline: 0 }"],
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 85),
          at("apps/me/src/components/ui/site-footer.astro", 54),
          at("apps/trends/src/components/digest-view.astro", 53),
        ],
      },
      {
        rule: "ブレークポイントは 640 / 768 / 1280px の 3 段。range syntax で書く",
        values: ["(width >= 640px)", "(width >= 768px)", "(width >= 1280px)"],
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 90),
          at("packages/ui/src/link-card.astro", 238),
          at("apps/art/src/layouts/base-layout.astro", 96),
          at("apps/diary/src/layouts/base-layout.astro", 85),
        ],
      },
      {
        rule: "右サイドバー(目次)は 1280px 以上でのみ fixed で出す",
        values: ["position: fixed", "top: 13rem", "right: 2rem"],
        evidence: [
          at("apps/me/src/layouts/blog-layout.astro", 172),
          at("apps/trends/src/components/digest-view.astro", 42),
          at("apps/me/src/features/blog/components/ui/toc.astro", 40),
        ],
      },
      {
        rule: "縦リズムは --space-1 / 2 / 3 を最小単位に、セクション間は --space-8〜12",
        detail:
          "margin / padding / gap でトークンと一致する値は var(--space-*) で書く。0.125rem や 2.5rem のようにトークンのない値だけ生 rem。",
        values: ["--space-1: 0.25rem", "--space-3: 0.75rem", "--space-8: 2rem", "--space-12: 3rem"],
        evidence: [
          at("apps/me/src/layouts/blog-layout.astro", 292),
          at("apps/memo/src/components/thread-post.astro", 246),
        ],
      },
      {
        rule: "幅の上限は用途別に 3 種: 読み物 42rem、画像 1440px、ドキュメント 84rem",
        values: ["--content-width: 42rem", "min(100% - 5rem, 1440px)", "--site-width: 84rem"],
        evidence: [
          at("packages/styles/tokens.css", 41),
          at("apps/art/src/layouts/base-layout.astro", 91),
          at("apps/diary/src/layouts/base-layout.astro", 80),
        ],
      },
      {
        rule: "コンテナクエリは局所レイアウトにだけ使う",
        detail: "メディアクエリの代替ではない。alert ブロックと design のステージ列。",
        evidence: [at("apps/me/src/features/blog/components/ui/blocks/alert-block.astro", 42)],
      },
    ],
  },
  {
    id: "images",
    title: "Images",
    items: [
      {
        rule: "blur-up はプレースホルダを背景に敷き、.image-loaded で blur(36px) を解く",
        values: ['getImage({ width: 20, height: 11, format: "avif" })', "filter: blur(36px)"],
        evidence: [
          at("packages/ui/src/link-card.astro", 36),
          at("packages/ui/src/blur-image.astro", 45),
          at("apps/me/src/components/ui/image/image.astro", 12),
        ],
      },
      {
        rule: "解除ハンドラは onload と onerror の両方をインライン属性で付ける",
        detail: "共有ヘルパ blurLoadHandlers を使う。",
        values: ['blurLoadHandlers(".blur-load")'],
        evidence: [
          at("packages/ui/src/blur-load.ts", 11),
          at("packages/ui/src/blur-image.astro", 69),
          at("apps/me/src/components/ui/image/image.astro", 49),
        ],
      },
      {
        rule: "JS 無効時は noscript でブラーを解く。全レイアウトが BlurLoadNoscript を置く",
        evidence: [
          at("packages/ui/src/blur-load-noscript.astro", 8),
          at("apps/me/src/layouts/base-layout.astro", 43),
          at("apps/memo/src/layouts/layout.astro", 26),
          at("apps/art/src/layouts/base-layout.astro", 71),
        ],
      },
      {
        rule: "配信形式は avif(写真は webp 併記)、quality 80、widths + 明示 sizes",
        values: ['format="avif"', "quality={80}", "widths={[...]}", 'sizes="..."'],
        evidence: [
          at("apps/me/src/components/ui/image/image.astro", 33),
          at("apps/diary/src/components/diary-image.astro", 25),
          at("apps/art/src/components/work-figure.astro", 20),
          at("packages/ui/src/link-card.astro", 97),
        ],
      },
      {
        rule: "遅延読み込みは loading=lazy と decoding=async を対で。優先画像は eager + fetchpriority=high",
        values: ['loading="lazy" decoding="async"', 'loading="eager" fetchpriority="high"'],
        evidence: [
          at("packages/ui/src/link-card.astro", 74),
          at("apps/lgtm/src/pages/[...page].astro", 104),
          at("packages/ui/src/blur-image.astro", 67),
        ],
      },
      {
        rule: "CLS 回避のため aspect-ratio を CSS 変数で流し込む",
        values: ["aspect-ratio: var(--aspect-ratio)"],
        evidence: [
          at("apps/me/src/components/ui/image/image.astro", 53),
          at("packages/ui/src/link-card.astro", 210),
        ],
      },
      {
        rule: "装飾画像と、キャプションが本文を持つ画像は alt を空にする",
        detail:
          "二重読み上げを避ける。me の図版はキャプションと alt が同文のときだけ空にする(figureAlt)。",
        values: ['alt=""'],
        evidence: [
          at("apps/art/src/components/work-figure.astro", 16),
          at("apps/memo/src/components/profile-header.astro", 25),
          at("packages/ui/src/link-card.astro", 62),
          at("apps/me/src/utils/image-alt.ts", 6),
        ],
      },
      {
        rule: "アバターは円形 + 内側 1px の outline",
        values: [
          "border-radius: 50%",
          "outline: 1px solid var(--c-border)",
          "outline-offset: -0.5px",
        ],
        evidence: [
          at("apps/memo/src/components/avatar.astro", 40),
          at("apps/memo/src/features/search/components/search-dialog.astro", 62),
        ],
      },
    ],
  },
  {
    id: "interaction",
    title: "Interaction & focus",
    items: [
      {
        rule: "フォーカスリングは 1 種。クリップされる要素だけ負の offset で内側に描く",
        detail: "full-bleed な行やカードなど 7 箇所で同じ意図。",
        values: ["outline-offset: calc(-1 * var(--ring-width))"],
        evidence: [
          at("packages/styles/base.css", 8),
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 113),
          at("apps/memo/src/features/search/components/search-dialog.astro", 52),
          at("apps/trends/src/pages/archive.astro", 79),
        ],
      },
      {
        rule: "スクロールバーはページ 8px、内側スクローラ 3px + --c-sub。Firefox は @supports で分岐",
        values: ["::-webkit-scrollbar { width: 3px }", "@supports (-moz-appearance: none)"],
        evidence: [
          at("packages/styles/base.css", 24),
          at("apps/me/src/features/blog/components/ui/toc.astro", 23),
          at("packages/styles/base.css", 82),
          at("apps/trends/src/components/source-toc.astro", 38),
        ],
      },
      {
        rule: "モーダルとメニューは JS を書かず popover / dialog + invoker commands で開く",
        values: ['command="show-modal"', "commandfor", "popovertarget", 'closedby="any"'],
        evidence: [
          at("apps/memo/src/features/search/components/search-button.astro", 10),
          at("packages/search/src/dialog.astro", 19),
          at("apps/me/src/components/ui/site-nav.astro", 49),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 46),
        ],
      },
      {
        rule: "アンカーポジショニングには必ず @supports not のフォールバックを添える",
        values: ["@supports not (anchor-name: --x)", "@position-try"],
        evidence: [
          at("apps/me/src/components/ui/site-nav.astro", 168),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 159),
          at("apps/me/src/layouts/blog-layout.astro", 220),
        ],
      },
      {
        rule: "テキスト入力は 16px 未満にしない",
        detail: "iOS がフォーカス時にズームするのを防ぐ。",
        values: ["font-size: max(16px, var(--fs-base))"],
        evidence: [at("packages/search/src/dialog.astro", 160)],
      },
      {
        rule: "内側スクローラには overscroll-behavior: contain を付ける",
        values: ["overscroll-behavior: contain"],
        evidence: [
          at("apps/me/src/features/blog/components/ui/toc.astro", 110),
          at("packages/search/src/dialog.astro", 253),
          at("apps/trends/src/components/source-toc.astro", 67),
        ],
      },
      {
        rule: "カード全体クリックは data-href + 親のイベント委譲。選択中テキストと内部リンクは除外",
        values: ["data-clickable", "data-href"],
        evidence: [
          at("apps/memo/src/components/thread-post.astro", 69),
          at("apps/memo/src/components/feed.astro", 36),
          at("apps/memo/src/components/quote-embed.astro", 34),
        ],
      },
      {
        rule: "クリック可能なカードは user-select: none",
        evidence: [
          at("packages/ui/src/link-card.astro", 111),
          at("apps/memo/src/components/quote-embed.astro", 63),
          at("apps/me/src/components/ui/image/image.astro", 80),
        ],
      },
      {
        rule: "ボタンは共有 .btn と 3 つの variant。個別実装は chrome の丸アイコンボタンだけ",
        values: ["height: 2.25rem", "--radius-md", "--fs-sm", "--fw-medium", "1.5rem の丸ボタン"],
        evidence: [
          at("packages/styles/components.css", 5),
          at("packages/ui/src/site-header.astro", 79),
          at("apps/memo/src/features/search/components/search-button.astro", 19),
        ],
      },
      {
        rule: "無効状態は opacity + pointer-events: none",
        values: ["opacity: 0.5", "opacity: 0.25", "pointer-events: none"],
        evidence: [
          at("packages/styles/components.css", 37),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 137),
        ],
      },
    ],
  },
  {
    id: "icons",
    title: "Icons",
    items: [
      {
        rule: "アイコンは Lucide 由来の線画。属性は定型",
        values: [
          'viewBox="0 0 24 24"',
          'fill="none"',
          'stroke="currentColor"',
          'stroke-width="2"',
          'stroke-linecap="round"',
        ],
        evidence: [
          at("packages/ui/src/icons/globe.svg", 1),
          at("packages/ui/src/site-header.astro", 24),
          at("packages/ui/src/icons/search.svg", 1),
          at("packages/ui/src/icons/copy.svg", 1),
        ],
      },
      {
        rule: "ブランドアイコンだけ fill=currentColor + 独自 viewBox",
        evidence: [
          at("apps/me/src/components/icons/zenn.svg", 1),
          at("apps/memo/src/components/social-icon.astro", 17),
        ],
      },
      {
        rule: "表示サイズは 0.875rem / 1rem / 1.125rem の 3 段",
        evidence: [
          at("packages/ui/src/site-header.astro", 23),
          at("packages/styles/components.css", 51),
          at("apps/me/src/features/search/components/search-button.astro", 45),
        ],
      },
      {
        rule: "装飾アイコンは aria-hidden、意味を持つものは親に aria-label",
        evidence: [
          at("apps/memo/src/components/thread-post.astro", 74),
          at("apps/me/src/components/ui/site-nav.astro", 52),
          at("apps/me/src/features/blog/components/ui/blocks/alert-block.astro", 32),
        ],
      },
    ],
  },
  {
    id: "feedback",
    title: "Feedback & loading",
    items: [
      {
        rule: "検索の状態表示は p[role=status]。空のときも sr-only で残し、ライブリージョンを外さない",
        evidence: [at("packages/search/src/dialog.astro", 41)],
      },
      {
        rule: "検索結果の文言は 2 アプリで同一",
        values: ["「{query}」に一致する〜はありません", "{total} 件中 {shown} 件を表示"],
        evidence: [at("packages/search/src/runner.ts", 31)],
      },
      {
        rule: "無限スクロールは IntersectionObserver + rootMargin 200px。スピナーは最低 500ms 出す",
        detail: "終端と失敗はテキストで告知する。",
        values: ['rootMargin: "200px"', "500ms"],
        evidence: [
          at("packages/ui/src/infinite-scroll.ts", 142),
          at("packages/ui/src/infinite-scroll.ts", 9),
          at("apps/lgtm/src/pages/[...page].astro", 124),
        ],
      },
      {
        rule: "ローディング枠は grid 中央寄せ、padding 2rem、--fs-xs",
        evidence: [at("packages/ui/src/infinite-scroll.astro", 43)],
      },
      {
        rule: "空状態は 1 行の日本語テキストだけ。イラストやアイコンは置かない",
        evidence: [
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 80),
          at("apps/trends/src/components/service-card.astro", 31),
        ],
      },
    ],
  },
  {
    id: "head",
    title: "Head & meta",
    items: [
      {
        rule: "meta color-scheme を CSS より先に置く",
        detail:
          "ダーク環境での白フラッシュ防止。同じコメントが 5 アプリにある。lang は文書の言語に合わせる(art / lgtm は en)。",
        values: ['<meta name="color-scheme" content="light dark">'],
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 24),
          at("apps/memo/src/layouts/layout.astro", 16),
          at("apps/lgtm/src/layouts/layout.astro", 28),
          at("apps/trends/src/layouts/base-layout.astro", 24),
        ],
      },
      {
        rule: "favicon は 4 点セット",
        values: [
          'favicon.ico sizes="32x32"',
          "icon.svg",
          "apple-touch-icon.png",
          "manifest.webmanifest",
        ],
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 28),
          at("apps/trends/src/layouts/base-layout.astro", 28),
          at("apps/art/src/layouts/base-layout.astro", 37),
        ],
      },
      {
        rule: "Web フォントは読まない。本文は system-ui、Inter は OG 画像専用",
        values: ["font-family: system-ui, sans-serif"],
        evidence: [at("packages/styles/base.css", 17), at("packages/og/src/og.tsx", 57)],
      },
      {
        rule: "OG カードは 1200×630、左下寄せ、padding 80px、fontSize 70px",
        evidence: [at("packages/og/src/og.tsx", 31), at("packages/seo/src/open-graph.astro", 46)],
      },
      {
        rule: "description は 200 字に切る。既定値をどのアプリも上書きしない",
        values: ["truncateDescription"],
        evidence: [
          at("packages/seo/src/base-seo.astro", 25),
          at("packages/seo/src/open-graph.astro", 51),
        ],
      },
      {
        rule: "Umami は websiteId と domains を対で渡す。イベント名は kebab-case、計測対象はナビと検索だけ",
        values: ["data-umami-event", "data-umami-event-label"],
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 35),
          at("apps/memo/src/layouts/layout.astro", 19),
          at("apps/me/src/components/ui/site-nav.astro", 23),
        ],
      },
      {
        rule: "JSON-LD は script[is:inline][type=application/ld+json] に set:html で流す",
        evidence: [
          at("apps/me/src/components/seo/json-ld.astro", 9),
          at("packages/seo/src/json-ld.astro", 23),
        ],
      },
    ],
  },
  {
    id: "dark",
    title: "Dark mode",
    items: [
      {
        rule: "ダークの境界線は色ではなく不透明度で作る。ライトはグレーの実色",
        values: ["oklch(var(--uchu-yang-raw) / 10%)"],
        evidence: [
          at("packages/styles/tokens.css", 46),
          at("apps/me/src/styles/global.css", 34),
          at("apps/me/src/styles/prose.css", 236),
        ],
      },
      {
        rule: "影とグローはダークでだけ効かせ、ライトでは透明に落とす",
        evidence: [
          at("apps/me/src/features/blog/components/ui/toc.astro", 93),
          at("apps/me/src/components/ui/image/image.astro", 83),
        ],
      },
      {
        rule: "外部由来の画像(favicon)はダークでもライト地を敷く",
        evidence: [at("packages/ui/src/link-card.astro", 183)],
      },
      {
        rule: "box-shadow は原則 --shadow-sm だけ。多層の落ち影はモーダルとポップオーバーの 3 箇所に限る",
        values: ["0 14px 28px -6px", "0 2px 4px -1px"],
        evidence: [
          at("packages/styles/tokens.css", 39),
          at("packages/search/src/dialog.astro", 72),
          at("apps/me/src/features/blog/components/ui/toc.astro", 113),
        ],
      },
    ],
  },
  {
    id: "misc",
    title: "Other patterns",
    items: [
      {
        rule: "リセットは kiso.css を @layer reset で読む。import 4 行の順序は全アプリ共通",
        evidence: [
          at("apps/me/src/styles/global.css", 1),
          at("apps/memo/src/styles/global.css", 1),
          at("apps/art/src/styles/global.css", 1),
        ],
      },
      {
        rule: "アプリ固有の色は @layer tokens 内で --c-* を追加する",
        detail: "コンポーネントから --uchu-* を直接使わない。",
        values: ["--c-star", "--c-faint", "--c-bg-gray", "--c-codeblock-bg"],
        evidence: [
          at("apps/trends/src/styles/global.css", 14),
          at("apps/lgtm/src/styles/global.css", 14),
          at("apps/me/src/styles/global.css", 16),
        ],
      },
      {
        rule: "アンカーの飛び先には scroll-margin を置く",
        values: ["scroll-margin: 3rem", "scroll-margin-top: 1.25rem"],
        evidence: [
          at("apps/me/src/features/blog/components/ui/blocks/heading.astro", 25),
          at("apps/trends/src/components/service-card.astro", 61),
          at("apps/art/src/pages/index.astro", 79),
        ],
      },
      {
        rule: "サーフェスに載せる小アイコンは 2〜2.5rem 角、--radius-md、--c-surface、--shadow-sm",
        evidence: [
          at("apps/me/src/components/ui/emoji-eye-catch.astro", 26),
          at("apps/me/src/features/blog/components/ui/site-icon.astro", 28),
        ],
      },
      {
        rule: "行数を切るときは text-overflow ではなく -webkit-line-clamp",
        values: ["-webkit-line-clamp: 2", "-webkit-line-clamp: 1"],
        evidence: [
          at("packages/ui/src/link-card.astro", 152),
          at("apps/me/src/features/blog/components/ui/toc.astro", 184),
          at("apps/trends/src/components/source-toc.astro", 138),
        ],
      },
    ],
  },
];
