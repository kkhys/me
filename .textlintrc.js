module.exports = {
  filters: {
    comments: {
      enablingComment: "textlint-enable",
      disablingComment: "textlint-disable",
    },
    allowlist: {
      allowlistConfigPaths: ["textlint/allow.yml"],
    },
  },
  rules: {
    "max-ten": {
      // 1文に利用できる最大の、の数
      max: 3,
      // 例外ルールを適応するかどうか
      strict: false,
      // 読点として扱う文字
      touten: "、",
      // 句点として扱う文字
      kuten: "。",
    },
    "max-kanji-continuous-len": {
      // 連続できる漢字の文字数
      max: 6,
      // 例外として無視する単語
      allow: ["東急田園都市線"],
    },
    "no-mix-dearu-desumasu": {
      // 見出し
      preferInHeader: "である",
      // 本文
      preferInBody: "である",
      // 箇条書き
      preferInList: "である",
      // 文末以外でも、敬体と常体を厳しくチェックするかどうか
      strict: true,
    },
    "no-doubled-joshi": {
      // 助詞のtoken同士の間隔値が1以下ならエラーにする
      min_interval: 1,
      // 例外を許可するかどうか
      strict: false,
      // 複数回の出現を許す助詞
      allow: ["も", "や"],
      // 文の区切り文字となる配列
      separatorCharacters: ["。", "？", "！"],
      commaCharacters: ["、"],
    },
    "no-mixed-zenkaku-and-hankaku-alphabet": {
      prefer: "半角",
    },
    "sentence-length": {
      max: 100,
      skipUrlStringLink: true,
    },
    "first-sentence-length": {
      max: 50,
    },
    "ja-no-mixed-period": {
      // 優先する句点文字
      periodMark: "。",
      // 句点文字として許可する文字列の配列
      allowPeriodMarks: [],
      // 末尾に絵文字を置くことを許可するか
      allowEmojiAtEnd: false,
      // 句点で終わって無い場合に`periodMark`を--fix時に追加するかどうか
      forceAppendPeriod: false,
    },
    // "no-dead-link": {
    //   // 相対URIの可用性をチェック
    //   checkRelative: true,
    //   // 相対URIを解決するために使用されるベースURI
    //   baseURI: "https://ktnkk.com/",
    //   // 無視するURIまたはglobの配列
    //   ignore: ["https://github.com/ktnkk/*"],
    //   // デフォルトのリクエストの代わりにオリジンのURLに接続できるようにするOriginの配列
    //   preferGET: [],
    //   // リダイレクト（3xxステータスコード）をチェック
    //   ignoreRedirects: false,
    //   // 再試行してURLをチェックする回数
    //   retry: 3,
    //   // httpヘッダーをカスタマイズ
    //   userAgent: "textlint-rule-no-dead-link/1.0"
    // },
    prh: {
      checkLink: false,
      checkBlockQuote: false,
      checkEmphasis: true,
      checkHeader: false,
      rulePaths: ["textlint/prh.yml"],
    },
    "no-double-negative-ja": true,
    "no-hankaku-kana": true,
    "ja-no-weak-phrase": true,
    "ja-no-redundant-expression": true,
    "ja-no-abusage": true,
    "no-dropping-the-ra": true,
    "no-doubled-conjunctive-particle-ga": true,
    "no-doubled-conjunction": true,
    "ja-hiragana-keishikimeishi": true,
    "ja-hiragana-fukushi": true,
    "ja-hiragana-hojodoushi": true,
    "ja-unnatural-alphabet": true,
    "@textlint-ja/textlint-rule-no-insert-dropping-sa": true,
    "prefer-tari-tari": true,
    "@textlint-ja/no-filler": true,
    // "preset-jtf-style": true
  },
};
