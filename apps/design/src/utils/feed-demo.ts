/* Fixture feed for the InfiniteScroll demo. Page 1 renders on the Components
   page (and in /preview/infinite-scroll); the later pages exist only as the
   fetch targets under `basePath`, exactly like a memo / lgtm feed. */
export const FEED_DEMO = {
  containerId: "demo-feed",
  basePath: "/preview/infinite-scroll",
  pageSize: 6,
  total: 24,
} as const;

export interface FeedDemoItem {
  id: number;
  text: string;
}

export interface FeedDemoPage {
  currentPage: number;
  totalPages: number;
  items: FeedDemoItem[];
}

const LINES = [
  "朝の光が机の端まで届く頃、ようやくコーヒーが冷めた。",
  "駅前の書店が改装していて、児童書の棚が入口に移っていた。",
  "傘を忘れた日に限って、帰り道だけ雨が降る。",
  "古い写真の裏に、鉛筆で日付が書いてあった。",
  "夜の公園でラジオの音が遠くから聞こえてくる。",
  "雑貨屋で買った青いマグカップは、思ったより重かった。",
  "散歩の途中で見つけた石段は、途中で草に埋もれていた。",
  "窓を開けると、遠くの工事の音と鳥の声が混ざった。",
] as const;

export const FEED_DEMO_ITEMS: readonly FeedDemoItem[] = Array.from(
  { length: FEED_DEMO.total },
  (_, index) => ({ id: index + 1, text: LINES[index % LINES.length] ?? "" }),
);

export const feedDemoPageCount = (): number => Math.ceil(FEED_DEMO.total / FEED_DEMO.pageSize);

/** Items of one page, or `undefined` outside `1..feedDemoPageCount()`. */
export const feedDemoPage = (page: number): FeedDemoPage | undefined => {
  const totalPages = feedDemoPageCount();
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return undefined;
  const start = (page - 1) * FEED_DEMO.pageSize;
  return {
    currentPage: page,
    totalPages,
    items: FEED_DEMO_ITEMS.slice(start, start + FEED_DEMO.pageSize),
  };
};
