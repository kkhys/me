import { sleep } from "k6";
import http from "k6/http";
import { Counter, Rate } from "k6/metrics";
import CONFIG from "./config.ts";
import {
  basicChecks,
  logError,
  printTestStats,
  randomSleep,
  recordMetrics,
  weightedRandom,
} from "./utils.ts";

export const errorRate = new Rate("errors");
export const requestCount = new Counter("requests");

export const options = {
  scenarios: {
    normal_load: CONFIG.SCENARIOS.normal_load,
  },
  thresholds: CONFIG.THRESHOLDS.basic,
};

const metrics = {
  errorRate,
  requestCount,
};

export default function () {
  printTestStats({ startTime: new Date().toISOString() });

  // 1. ホームページ訪問
  let response = http.get(`${CONFIG.BASE_URL}/`);
  basicChecks(response, "Homepage", 200, 1000);
  logError(response, `${CONFIG.BASE_URL}/`, "Homepage");
  recordMetrics(response, metrics, "homepage");

  sleep(CONFIG.USER_BEHAVIOR.view_time.home);

  // 2. ブログ一覧ページ
  response = http.get(`${CONFIG.BASE_URL}/blog`);
  basicChecks(response, "Blog_list", 200, 1000);
  logError(response, `${CONFIG.BASE_URL}/blog`, "Blog list");
  recordMetrics(response, metrics, "blog_list");

  sleep(CONFIG.USER_BEHAVIOR.view_time.blog_list);

  // 3. ランダムなブログ記事を読む（確率的）
  if (Math.random() < CONFIG.USER_BEHAVIOR.probabilities.read_blog_post) {
    const blogPosts = CONFIG.URLS.blogPosts.map((post) => ({
      item: post,
      weight: 1,
    }));

    const randomPost = weightedRandom(blogPosts);
    response = http.get(`${CONFIG.BASE_URL}${randomPost}`);
    basicChecks(response, "Blog_post", 200, 2000);
    logError(response, `${CONFIG.BASE_URL}${randomPost}`, "Blog post");
    recordMetrics(response, metrics, "blog_post");

    sleep(CONFIG.USER_BEHAVIOR.view_time.blog_post);
  }

  // 4. その他のページもランダムに訪問
  if (Math.random() < CONFIG.USER_BEHAVIOR.probabilities.view_additional_page) {
    const pages = CONFIG.URLS.pages.map((page) => ({
      item: page,
      weight: page === "/about" ? 0.5 : 1, // aboutページの重み調整
    }));

    const randomPage = weightedRandom(pages);
    response = http.get(`${CONFIG.BASE_URL}${randomPage}`);
    basicChecks(response, "Additional_page", 200, 1000);
    logError(response, `${CONFIG.BASE_URL}${randomPage}`, "Additional page");
    recordMetrics(response, metrics, "additional_page");

    // ランダムな閲覧時間
    sleep(randomSleep(1, CONFIG.USER_BEHAVIOR.view_time.other + 1));
  }
}
