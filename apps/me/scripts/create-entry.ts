import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type CategoryTitle, categories } from "#/features/blog/config/category";
import { generateBech32m } from "#/utils/hash";

interface Frontmatter {
  title: string;
  emoji: string;
  category: CategoryTitle;
  tags: string;
  status: "draft" | "published";
  publishedAt: string;
  slug: string;
}

const getTodayDate = () => {
  const today = new Date();
  const datePart = today.toISOString().split("T")[0];
  if (!datePart) {
    throw new Error("Failed to extract date part from ISO string");
  }
  return datePart;
};

const validateDateFormat = (dateString: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date.toISOString().split("T")[0] === dateString;
};

const prompt = (question: string): Promise<string> =>
  new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data) => resolve(data.toString().trim()));
  });

const selectCategory = async (): Promise<CategoryTitle> => {
  console.log("\nカテゴリーを選択してください:");

  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.emoji} ${category.title} (${category.label})`);
  });

  const choice = await prompt(`選択してください (1-${categories.length}): `);
  const choiceIndex = Math.trunc(Number(choice)) - 1;

  if (choiceIndex >= 0 && choiceIndex < categories.length) {
    const selectedCategory = categories[choiceIndex];
    if (selectedCategory) {
      return selectedCategory.title;
    }
  }

  console.log("無効な選択です。最初のカテゴリーを選択します。");
  return categories[0]?.title || "Tech";
};

const inputPublishedDate = async () => {
  const defaultDate = getTodayDate();
  const input = await prompt("公開日を入力してください (yyyy-mm-dd形式、空白で今日の日付): ");

  if (input === "") {
    console.log(`今日の日付を使用します: ${defaultDate}`);
    return defaultDate;
  }

  if (!validateDateFormat(input)) {
    console.log("無効な日付形式です。今日の日付を使用します。");
    return defaultDate;
  }

  return input;
};

const checkFileExists = (filePath: string) => {
  if (existsSync(filePath)) {
    throw new Error(`ファイルが既に存在します: ${filePath}`);
  }
};

const generateMDXContent = (frontmatter: Frontmatter) => {
  if (!validateDateFormat(frontmatter.publishedAt)) {
    throw new Error(`Invalid date format: ${frontmatter.publishedAt}. Expected format: yyyy-mm-dd`);
  }

  return `---
title: ${frontmatter.title}
emoji: ${frontmatter.emoji}
category: ${frontmatter.category}
tags: ${frontmatter.tags}
status: ${frontmatter.status}
publishedAt: ${frontmatter.publishedAt}
slug: ${frontmatter.slug}
---

`;
};

const main = async () => {
  console.log("📝 新しいブログ記事を作成します\n");

  try {
    const title = await prompt("タイトルを入力してください: ");
    const emoji = (await prompt("絵文字を入力してください (空白で☑️): ")) || "☑️";
    const category = await selectCategory();
    const publishedAt = await inputPublishedDate();

    const slug = generateBech32m(publishedAt, "b");

    const frontmatter: Frontmatter = {
      title,
      emoji,
      category,
      tags: "[]",
      status: "draft",
      publishedAt,
      slug,
    };

    const dirPath = join("me-content", "blog", publishedAt);
    const filePath = join(dirPath, "index.mdx");

    checkFileExists(filePath);

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
      console.log(`\n📁 ディレクトリを作成しました: ${dirPath}`);
    }

    const content = generateMDXContent(frontmatter);
    writeFileSync(filePath, content, "utf8");

    console.log("\n✅ ブログ記事を作成しました!");
    console.log(`📄 ファイル: ${filePath}`);
    console.log(`🏷️  スラッグ: ${frontmatter.slug}`);
    console.log(`📅 日付: ${frontmatter.publishedAt}`);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  }

  process.exit(0);
};

process.stdin.setEncoding("utf8");

try {
  await main();
} catch (error) {
  console.error("予期しないエラーが発生しました:", error);
  process.exit(1);
}
