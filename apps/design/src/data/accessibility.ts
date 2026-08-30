/* Accessibility rules recovered from the apps and shared packages, the
   token pairs the Accessibility page grades for contrast, the known gaps
   and the checklist for a new screen. Rendered by pages/accessibility.astro.
   Line numbers point at main; re-check them when the cited file changes. */

import { at, type ConventionGroup, type Evidence } from "#/data/conventions";
import type { ContrastUse } from "#/utils/color";

export interface ContrastPair {
  /** Foreground token (text, ring, border). */
  fg: string;
  /** Background token it sits on. */
  bg: string;
  use: ContrastUse;
  /** Where the pair appears. */
  label: string;
}

/* Every token pair the apps paint text or UI parts with. Backgrounds are
   opaque tokens; a translucent foreground (the ring, the dark border) is
   composited over its background before grading. Decorative pairs are
   listed for the record and marked exempt rather than failed. */
export const CONTRAST_PAIRS: ContrastPair[] = [
  { fg: "--c-text", bg: "--c-bg", use: "text", label: "本文" },
  { fg: "--c-sub", bg: "--c-bg", use: "text", label: "補助テキスト・日付・ナビ" },
  { fg: "--c-link", bg: "--c-bg", use: "text", label: "本文リンク" },
  { fg: "--c-link-visited", bg: "--c-bg", use: "text", label: "訪問済みリンク(prose)" },
  { fg: "--c-danger", bg: "--c-bg", use: "text", label: "警告テキスト(逸脱の注記など)" },
  {
    fg: "--c-surface-text",
    bg: "--c-surface",
    use: "text",
    label: "サーフェス上の文字(hover 行、絵文字枠)",
  },
  { fg: "--c-sub", bg: "--c-surface", use: "text", label: "サーフェス上の補助テキスト" },
  { fg: "--c-primary-text", bg: "--c-primary", use: "text", label: "塗りボタン・現在のカテゴリ" },
  { fg: "--c-text", bg: "--c-selection", use: "text", label: "選択中のテキスト(::selection)" },
  { fg: "--ring", bg: "--c-bg", use: "ui", label: "フォーカスリング" },
  { fg: "--c-primary", bg: "--c-bg", use: "ui", label: "塗りボタンの輪郭" },
  { fg: "--c-scrollbar", bg: "--c-bg", use: "decorative", label: "スクロールバーのつまみ" },
  { fg: "--c-border", bg: "--c-bg", use: "decorative", label: "境界線(髪の毛ライン)" },
  { fg: "--c-surface", bg: "--c-bg", use: "decorative", label: "サーフェス(カード・行の hover)" },
];

export const A11Y_GROUPS: ConventionGroup[] = [
  {
    id: "focus",
    title: "Focus",
    items: [
      {
        rule: "フォーカスリングは base.css の :focus-visible 1 本。要素ごとに色や形を変えない",
        detail:
          "outline なので角丸に追従し、レイアウトを揺らさず、Forced Colors でも消えない。kiso.css の outline-offset 3px を 2px で上書きしている。--ring は --c-ring の 70% 透過で、背景に対して 3:1 を超える(上の表)。",
        values: [
          "outline: var(--ring-width) solid var(--ring)",
          "--ring-width: 2px",
          "--ring-offset: 2px",
        ],
        evidence: [at("packages/styles/base.css", 12), at("packages/styles/tokens.css", 69)],
      },
      {
        rule: "outline: none を書くのは、同じ要素で :focus-visible を再宣言するときだけ",
        detail:
          ".btn と検索ダイアログの入力欄がその形。入力欄は行の中に箱を持たないので、リングの代わりに同じ色の下線を box-shadow で引き、Forced Colors では outline に戻す。リングを消したまま代替を置かない要素を作らない。",
        evidence: [
          at("packages/styles/components.css", 21),
          at("packages/styles/components.css", 42),
          at("packages/search/src/dialog.astro", 169),
          at("packages/search/src/dialog.astro", 174),
        ],
      },
      {
        rule: "hover で現れる UI には :focus-within の対を必ず置く",
        detail:
          "目次パネルと見出しのアンカーアイコン。ポインタがない環境でも Tab で同じものが出る。",
        values: [".toc:focus-within .toc-panel", ".heading-link:focus .anchor-wrapper"],
        evidence: [
          at("apps/me/src/features/blog/components/ui/toc.astro", 126),
          at("apps/me/src/features/blog/components/ui/blocks/heading.astro", 51),
        ],
      },
      {
        rule: "見た目を消したフォーム部品は display: none ではなく opacity: 0 でツリーに残す",
        detail:
          "テーマ切替のラジオ。キーボードと読み上げには本物の input が届き、リングは label:has(:focus-visible) で描く。",
        evidence: [
          at("apps/design/src/components/theme-toggle.astro", 103),
          at("apps/design/src/components/theme-toggle.astro", 114),
        ],
      },
      {
        rule: "クリップされる要素のリングは負の offset で内側に描く",
        detail:
          "full-bleed な行、ピル型のページャ、横スクロールするチップ。Conventions の Interaction & focus と同じ規則。",
        values: ["outline-offset: calc(-1 * var(--ring-width))"],
        evidence: [
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 115),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 204),
          at("apps/me/src/features/blog/components/ui/category-navigation.astro", 91),
        ],
      },
      {
        rule: "スキップリンクを body の先頭に置き、main#main へ飛ばす",
        detail:
          "共有 SkipLink。フォーカスされるまで sr-only で、Tab の 1 回目に左上へ現れる。ラベルはページの言語で渡す。ヘッダーが本文の中にある art と diary には置かない。",
        values: ['<SkipLink label="本文へ移動" />', '<main id="main">'],
        evidence: [
          at("packages/ui/src/skip-link.astro", 15),
          at("apps/me/src/layouts/base-layout.astro", 41),
          at("apps/memo/src/layouts/layout.astro", 23),
          at("apps/lgtm/src/layouts/layout.astro", 35),
          at("apps/trends/src/layouts/base-layout.astro", 33),
        ],
      },
    ],
  },
  {
    id: "structure",
    title: "Structure",
    items: [
      {
        rule: "html lang は文書の言語。日本語サイトは ja、英語だけの art と lgtm は en",
        detail: "lgtm の法務ページは日本語版があるので、レイアウトが lang を prop で受ける。",
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 20),
          at("apps/memo/src/layouts/layout.astro", 12),
          at("apps/art/src/layouts/base-layout.astro", 23),
          at("apps/lgtm/src/layouts/layout.astro", 25),
          at("apps/lgtm/src/components/legal-page.astro", 27),
        ],
      },
      {
        rule: "本文は main#main に入れる。ヘッダー・ナビ・目次・フッターはその外",
        detail:
          "レイアウトが main を持つのが基本形。trends はページ側(digest-view、About、Archive)が持つ。",
        evidence: [
          at("apps/me/src/layouts/base-layout.astro", 44),
          at("apps/memo/src/layouts/layout.astro", 25),
          at("apps/diary/src/layouts/base-layout.astro", 57),
          at("apps/trends/src/components/digest-view.astro", 35),
          at("apps/trends/src/pages/archive.astro", 14),
        ],
      },
      {
        rule: "nav には aria-label を付け、同じページの複数の nav を名前で区別する。ラベルはページの言語",
        detail:
          "サイトナビ・フッターナビ・目次・ページャ・日付ナビが 1 ページに同居する。共有コンポーネントはラベルを prop で受ける(SiteFooter の navLabel、SiteHeader の backLabel)。",
        evidence: [
          at("apps/me/src/components/ui/site-nav.astro", 12),
          at("apps/me/src/components/ui/site-footer.astro", 11),
          at("apps/me/src/features/blog/components/ui/toc.astro", 15),
          at("apps/trends/src/components/date-nav.astro", 13),
          at("apps/art/src/components/pager.astro", 16),
          at("packages/ui/src/site-footer.astro", 17),
        ],
      },
      {
        rule: 'ナビの現在地は aria-current="page"。見た目は --fw-medium + --c-text',
        evidence: [
          at("apps/me/src/components/ui/site-nav.astro", 34),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 79),
          at("apps/design/src/components/site-sidebar.astro", 38),
        ],
      },
      {
        rule: "ページに h1 を 1 つ。他に見出しのないページは SiteHeader の heading でタイトルを h1 にする",
        detail:
          "lgtm の一覧・詳細と memo のフィード・スレッド・タグがその形。memo のプロフィールは名前が h1 なので heading を切る。lgtm の法務ページはタイトルを h1 として描く。",
        evidence: [
          at("apps/me/src/layouts/blog-layout.astro", 113),
          at("apps/memo/src/components/profile-header.astro", 44),
          at("apps/trends/src/components/digest-hero.astro", 15),
          at("packages/ui/src/site-header.astro", 29),
          at("apps/memo/src/components/header.astro", 43),
          at("apps/lgtm/src/components/legal-page.astro", 35),
        ],
      },
      {
        rule: "日付は time[datetime]、折りたたみは details/summary、検索 UI は search 要素",
        detail: "意味を持つ HTML 要素があるものは role で作り直さない。",
        evidence: [
          at("apps/me/src/features/blog/components/ui/entry-list.astro", 46),
          at("apps/memo/src/components/post-header.astro", 34),
          at("apps/trends/src/components/item-row.astro", 49),
          at("packages/search/src/dialog.astro", 20),
        ],
      },
      {
        rule: 'list-style を消したリストには role="list"',
        detail:
          'Safari は list-style: none のリストをリストとして読まない。kiso.css は list-style-type: "" で全体を守っているので、明示は art のグリッドだけ。',
        evidence: [
          at("apps/art/src/pages/index.astro", 22),
          at("apps/art/src/pages/index.astro", 51),
        ],
      },
      {
        rule: "アンカーの飛び先には scroll-margin。見出しへのリンクは見出し全体",
        evidence: [
          at("apps/me/src/features/blog/components/ui/blocks/heading.astro", 19),
          at("apps/design/src/styles/global.css", 93),
        ],
      },
    ],
  },
  {
    id: "images",
    title: "Images",
    items: [
      {
        rule: "alt は 3 通り: 内容を表す文、空、キャプションに任せて空",
        detail:
          'art の一覧は作品名、diary は日付と番号、アバターは人名。figcaption が本文を持つ図版と装飾は alt="" で二重読みを避ける。me の図版はキャプションが alt と同文のときだけ空にし、別文なら alt を残す。memo の添付は frontmatter の images[].alt、lgtm はエントリの description.txt を "LGTM over …" にして alt にする。',
        values: [
          "images:\n  - file: 01.jpg\n    alt: 干し芋の袋",
          "description.txt",
          "LGTM over <description>",
        ],
        evidence: [
          at("apps/art/src/pages/index.astro", 28),
          at("apps/diary/src/pages/index.astro", 39),
          at("apps/memo/src/components/thread-post.astro", 84),
          at("apps/art/src/components/work-figure.astro", 19),
          at("apps/memo/src/components/profile-header.astro", 25),
          at("apps/me/src/utils/image-alt.ts", 6),
          at("apps/memo/src/content.config.ts", 20),
          at("apps/memo/src/components/memo-images.astro", 19),
          at("apps/lgtm/src/loaders/lgtm-dir-loader.ts", 32),
          at("apps/lgtm/src/utils/alt.ts", 5),
        ],
      },
      {
        rule: 'canvas の演出は role="img" + aria-label、noscript でテキスト代替',
        evidence: [
          at("apps/me/src/features/pages/components/not-found-art.astro", 6),
          at("apps/me/src/features/pages/components/not-found-art.astro", 11),
        ],
      },
      {
        rule: "JS 無効でも画像が見えるよう、全レイアウトが BlurLoadNoscript でぼかしを解く",
        evidence: [
          at("packages/ui/src/blur-load-noscript.astro", 11),
          at("apps/me/src/layouts/base-layout.astro", 32),
          at("apps/memo/src/layouts/layout.astro", 22),
        ],
      },
      {
        rule: "アイコンだけの操作は親に aria-label、SVG は aria-hidden",
        detail: "Conventions の Icons と同じ。lgtm はさらに title で hover 時の説明を重ねる。",
        evidence: [
          at("packages/ui/src/site-header.astro", 22),
          at("apps/me/src/features/search/components/search-button.astro", 11),
          at("apps/design/src/components/code-block.astro", 22),
          at("apps/me/src/features/blog/components/ui/blocks/alert-block.astro", 32),
        ],
      },
    ],
  },
  {
    id: "interaction",
    title: "Keyboard & pointer",
    items: [
      {
        rule: "モーダルとメニューはネイティブ dialog / popover。フォーカストラップ・Esc・背景クリックはブラウザ任せ",
        detail: "自前で書くのは「開いたら入力欄へ」「Esc で入力を保持したまま閉じる」の 2 点だけ。",
        evidence: [
          at("packages/search/src/dialog.astro", 19),
          at("packages/search/src/dialog-setup.ts", 146),
          at("packages/search/src/dialog-setup.ts", 182),
          at("apps/me/src/components/ui/site-nav.astro", 58),
          at("apps/me/src/features/blog/components/ui/pagination.astro", 71),
        ],
      },
      {
        rule: "リスト内の移動は ↑↓。IME 変換中はキーを奪わない",
        detail:
          "isComposing のあいだは Esc も矢印も候補選択に使われるので、ダイアログは何もしない。",
        evidence: [
          at("packages/search/src/dialog-setup.ts", 191),
          at("packages/search/src/dialog-setup.ts", 181),
        ],
      },
      {
        rule: "トグルは button[aria-pressed]。見た目は属性セレクタで描き、状態を class と二重に持たない",
        evidence: [
          at("apps/trends/src/components/seen-filter.astro", 10),
          at("apps/trends/src/components/seen-filter.astro", 28),
          at("apps/me/src/features/search/components/search-dialog.astro", 9),
          at("apps/design/src/components/stage.astro", 28),
        ],
      },
      {
        rule: "JS 前提の UI は hidden 属性で出荷し、初期化が終わってから外す",
        detail: "JS なしでは効かないトグルを、効かないまま見せない。",
        evidence: [
          at("apps/trends/src/components/seen-filter.astro", 9),
          at("apps/trends/src/components/seen-filter.astro", 52),
        ],
      },
      {
        rule: "localStorage は try/catch で包み、読めないときは既定表示に落とす",
        evidence: [
          at("apps/trends/src/components/seen-filter.astro", 34),
          at("apps/design/src/components/theme-init.astro", 14),
        ],
      },
      {
        rule: "カード全体クリックはポインタ向けの拡張。キーボードには中に本物の a を置く",
        detail:
          "link-card はカード全体が a。memo の data-href 委譲は選択中テキストと内部リンクを除外し、日時を投稿へのリンクにしてキーボードの入口にする。",
        evidence: [
          at("packages/ui/src/link-card.astro", 44),
          at("apps/memo/src/components/feed.astro", 48),
          at("apps/memo/src/components/post-header.astro", 33),
          at("apps/memo/src/components/quote-embed.astro", 39),
        ],
      },
      {
        rule: 'スクロールする領域はキーボードでも届くようにする。tabindex="0" か、中にフォーカスできるもの',
        evidence: [
          at("apps/design/src/components/demo.astro", 190),
          at("apps/me/src/features/blog/components/ui/toc.astro", 126),
        ],
      },
      {
        rule: "ターゲットは 24px 角が下限。文字だけのボタンは ::before で当たり判定を広げる",
        detail:
          "24px は WCAG 2.2 の 2.5.8 の最小値。丸アイコンボタンは 1.5rem、主要ボタンは 2.25〜2.5rem。見た目を変えたくない小さなトグルは inset: -0.25rem 0 の擬似要素で足りる。",
        values: ["height: 2.25rem", "width: 1.5rem", "&::before { inset: -0.25rem 0 }"],
        evidence: [
          at("packages/styles/components.css", 23),
          at("packages/ui/src/site-header.astro", 85),
          at("apps/trends/src/components/seen-filter.astro", 79),
          at("packages/search/src/dialog.astro", 211),
          at("apps/design/src/components/theme-toggle.astro", 87),
        ],
      },
      {
        rule: "ショートカットは修飾キー付き(⌘K / Ctrl+K)だけ。単キーは置かない",
        detail:
          "WCAG 2.1.4 は単キーのショートカットに無効化か付け替えを求める。設定画面のない静的サイトではどちらも用意できないので、検索を開く / は持たない。Alt を除外するのは AltGr で文字を打つ配列のため。",
        evidence: [
          at("packages/search/src/keyboard.ts", 5),
          at("packages/search/src/dialog-setup.ts", 219),
        ],
      },
      {
        rule: "テキスト入力は 16px 未満にしない",
        detail:
          "iOS がフォーカス時にページをズームするのを防ぐ。拡大を禁止する viewport 設定は持たない。",
        values: ["font-size: max(16px, var(--fs-base))", "width=device-width, initial-scale=1"],
        evidence: [
          at("packages/search/src/dialog.astro", 160),
          at("packages/ui/src/head-meta.astro", 19),
        ],
      },
      {
        rule: "新しいタブで開くリンクは sr-only で「(新しいタブで開く)」を添える",
        detail:
          "アイコンは aria-hidden なので、読み上げには文字で伝える。memo の本文リンクは rehype-external-links の content で同じ span を差し込む。",
        values: ['<span class="sr-only">(新しいタブで開く)</span>'],
        evidence: [
          at("apps/me/src/features/blog/components/link-handler.astro", 25),
          at("apps/me/src/components/ui/site-nav.astro", 27),
          at("packages/ui/src/link-card.astro", 53),
          at("apps/trends/src/components/item-row.astro", 35),
          at("apps/memo/astro.config.ts", 49),
        ],
      },
    ],
  },
  {
    id: "announce",
    title: "Announcements",
    items: [
      {
        rule: 'コピーなど視覚でしか返らない操作は、sr-only の role="status" に結果を書く',
        detail:
          "アイコンの差し替えだけでは読み上げに何も起きない。文言はページの言語で、1〜1.5 秒後に消す。",
        values: ['<span class="sr-only" role="status">', 'status.textContent = "コピーしました"'],
        evidence: [
          at("apps/design/src/components/code-block.astro", 27),
          at("apps/lgtm/src/pages/[...page].astro", 80),
          at("apps/lgtm/src/pages/[id].astro", 92),
        ],
      },
      {
        rule: '非同期の結果は role="status" に書く。空のときも要素を消さない',
        detail:
          "display: none にするとライブリージョンから外れ、最初の告知が落ちる。空のときは sr-only 相当で残す。",
        evidence: [
          at("packages/search/src/dialog.astro", 41),
          at("packages/search/src/dialog.astro", 231),
        ],
      },
      {
        rule: '無限スクロールは aria-live="polite"。終端は status、失敗は alert で差をつける',
        detail:
          "既定の文言は英語。日本語サイトは endMessage / errorMessage / loadingLabel を渡す。",
        evidence: [
          at("packages/ui/src/infinite-scroll.astro", 31),
          at("packages/ui/src/infinite-scroll.ts", 63),
          at("packages/ui/src/infinite-scroll.ts", 72),
          at("apps/memo/src/components/paginated-feed.astro", 31),
        ],
      },
      {
        rule: 'スピナーは role="status" + aria-label。回転だけを見せない',
        detail: 'ラベルは label prop。既定は "Loading"、memo は「読み込み中」。',
        evidence: [
          at("packages/ui/src/spinner.astro", 21),
          at("packages/ui/src/spinner.astro", 22),
        ],
      },
      {
        rule: ".sr-only は clip-path 版の定型",
        detail: "overflow: clip の祖先の中でも隠れたままになる。",
        evidence: [at("packages/styles/base.css", 68)],
      },
      {
        rule: "title 属性だけに情報を持たせない",
        detail:
          "title はポインタの hover でしか出ず、タッチとキーボードには届かない。日時の完全表記のように、見える文字の補足に限る。意味を持つ記号には sr-only の名前を添える。",
        evidence: [
          at("apps/memo/src/components/post-header.astro", 37),
          at("apps/trends/src/components/item-row.astro", 61),
          at("apps/trends/src/components/item-row.astro", 64),
        ],
      },
      {
        rule: "色だけの目印には sr-only のテキストを添える",
        detail: "一覧の下書きマーク(赤いバー)。",
        evidence: [at("apps/me/src/features/blog/components/ui/entry-list.astro", 74)],
      },
    ],
  },
];

export interface Gap {
  /** What is wrong, in one line. */
  issue: string;
  /** Who it affects and how. */
  impact: string;
  /** What would close it. */
  fix: string;
  /** WCAG 2.2 success criterion, e.g. "1.4.11 Non-text Contrast". */
  sc: string;
  severity: "high" | "medium" | "low";
  evidence: Evidence[];
}

/* Ordered by severity. Each entry is something a reader could verify from
   the cited lines; the contrast figures come from the table above. */
export const GAPS: Gap[] = [
  {
    issue: "alt 未記入の memo 添付画像",
    impact:
      'frontmatter に images[].alt を持たない旧 memo(151 件、155 枚)は "Image 1" のような番号だけで、何が写っているか伝わらない。新規投稿は studio が alt を必須にするので増えない。',
    fix: "memo-content の各 index.md に images[].alt を書く(コンテンツ側の作業)。書いた分から番号の alt が消える。",
    sc: "1.1.1 Non-text Content",
    severity: "medium",
    evidence: [
      at("apps/memo/src/utils/image-alt.ts", 15),
      at("apps/studio/src/memo-store.ts", 167),
      at("apps/studio/src/client.ts", 92),
    ],
  },
  {
    issue: "--fs-2xs は 10.4px",
    impact:
      "キャプション・トークン名・ページャに 29 箇所。拡大はできるので違反ではないが、既定のままでは読みづらい。",
    fix: "新規の UI では --fs-xs(12px)を下限にし、--fs-2xs は等幅のメタ情報に限る。",
    sc: "1.4.4 Resize Text",
    severity: "low",
    evidence: [at("packages/styles/tokens.css", 6), at("apps/art/src/components/pager.astro", 31)],
  },
];

/* What to run through before opening a PR that adds a screen. Short on
   purpose; the sections above hold the reasoning. */
export const CHECKLIST: string[] = [
  "main#main が 1 つ、h1 が 1 つ、nav には aria-label、body の先頭に SkipLink",
  "Tab だけで全操作に届く。カードは中に本物の a、hover で出るものは focus-within",
  "Tab でリングが見える。クリップされる要素は内側リング",
  "色はトークンのみ。上の表で AA 以上の組み合わせから選ぶ",
  "画像の alt は内容・空・キャプションのどれか。アイコンだけの操作は aria-label",
  "トグルは aria-pressed、現在地は aria-current、非同期の結果と操作の結果は role=status",
  "文字入力は 16px 以上、押せるものは 24px 角以上",
  "動きは transition だけ。animation を足すなら prefers-reduced-motion で切る",
  "読み上げテキスト(aria-label、status、新しいタブの注記)はページの言語",
  "VoiceOver(Safari)と 200% ズームで一度通す",
];
