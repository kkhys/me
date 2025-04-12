import { $ } from "bun";

const isDryRun = process.argv.includes("--dry-run");
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

if (!GITHUB_ACCESS_TOKEN) {
  console.error(
    "🚨 GitHub token is missing. Set GITHUB_ACCESS_TOKEN in your environment variables.",
  );
  process.exit(1);
}

const now = new Date();
const BASE_VERSION = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
let VERSION = BASE_VERSION;

const tags = (await $`git tag`.text())
  .split("\n")
  .filter((t) => t.startsWith(BASE_VERSION));

if (tags.includes(VERSION)) {
  let suffixCounter = 2;
  while (tags.includes(`${VERSION}-${suffixCounter}`)) {
    suffixCounter++;
  }
  VERSION = `${VERSION}-${suffixCounter}`;
}

console.log(`🔖 Creating tag: ${VERSION}`);
if (isDryRun) console.log("💡 Dry run mode is ON");

const CURRENT_BRANCH = (await $`git rev-parse --abbrev-ref HEAD`.text()).trim();

if (!isDryRun) {
  await $`git checkout main`;
  await $`git tag -f ${VERSION}`;
  await $`git push -f origin ${VERSION}`;
  await $`git checkout ${CURRENT_BRANCH}`;
  console.log(`✅ Released tag: ${VERSION} and returned to ${CURRENT_BRANCH}`);
} else {
  console.log("🚫 Would checkout main");
  console.log(`🚫 Would tag -f ${VERSION}`);
  console.log(`🚫 Would push -f origin ${VERSION}`);
  console.log(`🚫 Would checkout ${CURRENT_BRANCH}`);
}

const REPO_OWNER = "kkhys";
const REPO_NAME = "me";

console.log(`🚀 Preparing to create GitHub release for ${VERSION}`);

const getPreviousTag = async (): Promise<string | null> => {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (response.ok) {
    const releases: { tag_name: string }[] = (await response.json()) as {
      tag_name: string;
    }[];
    if (releases && releases.length > 0 && releases[0]?.tag_name) {
      return releases[0].tag_name;
    }
  } else {
    console.error("❌ Failed to fetch releases from GitHub.");
    const errorData = (await response.json()) as { message: string };
    console.error(`Error: ${errorData.message}`);
  }

  return null;
};

const createGitHubRelease = async () => {
  const previousTag = await getPreviousTag();

  let body = `Automatic release for version ${VERSION}.`;
  if (previousTag) {
    const compareUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/compare/${previousTag}...${VERSION}`;
    body += `\n\n[View changes since ${previousTag}](${compareUrl})`;
  } else {
    body += "\n\n(No previous release found for comparison.)";
  }

  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tag_name: VERSION,
        name: VERSION,
        body,
        draft: false,
        prerelease: false,
      }),
    },
  );

  if (response.ok) {
    const responseData = (await response.json()) as { html_url: string };
    console.log(`✅ GitHub Release created: ${responseData.html_url}`);
  } else {
    const errorData = (await response.json()) as { message: string };
    console.error("❌ Failed to create GitHub release.");
    console.error(`Error: ${errorData.message}`);
  }
};

if (!isDryRun) {
  await createGitHubRelease();
} else {
  console.log("🚫 Would create GitHub release");
  console.log(`🚫 Release tag: ${VERSION}`);
  console.log(`🚫 Release title: Release ${VERSION}`);
  console.log("✅ Dry run completed for GitHub release process");
}
