import { $ } from "bun";

interface ReleaseOptions {
  /** GitHub repository name, e.g. "me" or "memo". */
  repoName: string;
  /** GitHub repository owner. Defaults to "kkhys". */
  repoOwner?: string;
}

/**
 * Tags the current date as a release on `main`, pushes it, and creates a
 * matching GitHub Release. Pass `--dry-run` on argv to preview without
 * mutating git or calling the GitHub API. Requires `GITHUB_ACCESS_TOKEN`.
 */
export const release = async ({
  repoName,
  repoOwner = "kkhys",
}: ReleaseOptions) => {
  const isDryRun = process.argv.includes("--dry-run");
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;

  if (!githubAccessToken) {
    console.error(
      "[ERROR] GitHub token is missing. Set GITHUB_ACCESS_TOKEN in your environment variables.",
    );
    process.exit(1);
  }

  const now = new Date();
  const baseVersion = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  let version = baseVersion;

  const tags = (await $`git tag`.text())
    .split("\n")
    .filter((t) => t.startsWith(baseVersion));

  if (tags.includes(version)) {
    let suffixCounter = 2;
    while (tags.includes(`${version}-${suffixCounter}`)) {
      suffixCounter++;
    }
    version = `${version}-${suffixCounter}`;
  }

  console.log(`[RELEASE] Creating tag: ${version}`);
  if (isDryRun) console.log("[DRY-RUN] Mode is ON");

  const currentBranch = (
    await $`git rev-parse --abbrev-ref HEAD`.text()
  ).trim();

  if (!isDryRun) {
    await $`git checkout main`;
    await $`git tag -f -m ${version} ${version}`;
    await $`git push -f origin ${version}`;
    await $`git checkout ${currentBranch}`;
    console.log(
      `[SUCCESS] Released tag: ${version} and returned to ${currentBranch}`,
    );
  } else {
    console.log("[DRY-RUN] Would checkout main");
    console.log(`[DRY-RUN] Would tag -f ${version}`);
    console.log(`[DRY-RUN] Would push -f origin ${version}`);
    console.log(`[DRY-RUN] Would checkout ${currentBranch}`);
  }

  console.log(`[GITHUB] Preparing to create release for ${version}`);

  const getPreviousTag = async (): Promise<string | null> => {
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/releases`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const releases = (await response.json()) as { tag_name: string }[];
      if (releases && releases.length > 0 && releases[0]?.tag_name) {
        return releases[0].tag_name;
      }
    } else {
      console.error("[ERROR] Failed to fetch releases from GitHub.");
      const errorData = (await response.json()) as { message: string };
      console.error(`Error: ${errorData.message}`);
    }

    return null;
  };

  const createGitHubRelease = async () => {
    const previousTag = await getPreviousTag();

    let body = `Automatic release for version ${version}.`;
    if (previousTag) {
      const compareUrl = `https://github.com/${repoOwner}/${repoName}/compare/${previousTag}...${version}`;
      body += `\n\n[View changes since ${previousTag}](${compareUrl})`;
    } else {
      body += "\n\n(No previous release found for comparison.)";
    }

    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/releases`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag_name: version,
          name: version,
          body,
          draft: false,
          prerelease: false,
        }),
      },
    );

    if (response.ok) {
      const responseData = (await response.json()) as { html_url: string };
      console.log(`[SUCCESS] GitHub Release created: ${responseData.html_url}`);
    } else {
      const errorData = (await response.json()) as { message: string };
      console.error("[ERROR] Failed to create GitHub release.");
      console.error(`Error: ${errorData.message}`);
    }
  };

  if (!isDryRun) {
    await createGitHubRelease();
  } else {
    console.log("[DRY-RUN] Would create GitHub release");
    console.log(`[DRY-RUN] Release tag: ${version}`);
    console.log(`[DRY-RUN] Release title: ${version}`);
    console.log("[DRY-RUN] Completed GitHub release process");
  }
};
