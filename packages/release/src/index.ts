import { $ } from "bun";

import { buildReleaseBody } from "./github";
import { resolveReleaseVersion } from "./version";

interface ReleaseOptions {
  /** GitHub repository name, e.g. "me" or "memo". */
  repoName: string;
  /** GitHub repository owner. Defaults to "kkhys". */
  repoOwner?: string | undefined;
  /**
   * Preview the release: no tag, push, checkout, or GitHub API call. Remote
   * refs are still fetched (read-only) so the previewed version is accurate.
   */
  dryRun?: boolean | undefined;
}

/**
 * Tags the current date as a release on `main`, pushes it, and creates a
 * matching GitHub Release. Requires `GITHUB_ACCESS_TOKEN` unless `dryRun`.
 * Sets a non-zero exit code when any step fails.
 */
export const release = async ({
  repoName,
  repoOwner = "kkhys",
  dryRun = false,
}: ReleaseOptions) => {
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;

  if (!dryRun && !githubAccessToken) {
    console.error(
      "[ERROR] GitHub token is missing. Set GITHUB_ACCESS_TOKEN in your environment variables.",
    );
    process.exitCode = 1;
    return;
  }

  // Sync remote tags before resolving the suffix, so a release cut from a
  // machine with stale tags cannot reuse an existing version. Runs in dry-run
  // too — it only updates remote-tracking refs, and skipping it would preview
  // a version that a real release would not pick.
  await $`git fetch origin main --tags`;

  const now = new Date();
  const baseVersion = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

  const existingTags = (await $`git tag`.text()).split("\n");
  const version = resolveReleaseVersion(baseVersion, existingTags);

  console.log(`[RELEASE] Creating tag: ${version}`);
  if (dryRun) console.log("[DRY-RUN] Mode is ON");

  const currentBranch = (await $`git rev-parse --abbrev-ref HEAD`.text()).trim();

  if (dryRun) {
    console.log("[DRY-RUN] Would checkout main");
    console.log(`[DRY-RUN] Would tag -f ${version}`);
    console.log(`[DRY-RUN] Would push -f origin ${version}`);
    console.log(`[DRY-RUN] Would checkout ${currentBranch}`);
  } else {
    await $`git checkout main`;
    // Refuse to tag a stale or diverged main; --ff-only aborts on divergence.
    await $`git pull --ff-only origin main`;
    await $`git tag -f -m ${version} ${version}`;
    await $`git push -f origin ${version}`;
    await $`git checkout ${currentBranch}`;
    console.log(`[SUCCESS] Released tag: ${version} and returned to ${currentBranch}`);
  }

  console.log(`[GITHUB] Preparing to create release for ${version}`);

  const getPreviousTag = async (): Promise<string | null> => {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        "Content-Type": "application/json",
      },
    });

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

  const createGitHubRelease = async (): Promise<boolean> => {
    const previousTag = await getPreviousTag();
    const body = buildReleaseBody(version, previousTag, { repoOwner, repoName });

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`, {
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
    });

    if (response.ok) {
      const responseData = (await response.json()) as { html_url: string };
      console.log(`[SUCCESS] GitHub Release created: ${responseData.html_url}`);
      return true;
    }

    const errorData = (await response.json()) as { message: string };
    console.error("[ERROR] Failed to create GitHub release.");
    console.error(`Error: ${errorData.message}`);
    return false;
  };

  if (dryRun) {
    console.log("[DRY-RUN] Would create GitHub release");
    console.log(`[DRY-RUN] Release tag: ${version}`);
    console.log(`[DRY-RUN] Release title: ${version}`);
    console.log("[DRY-RUN] Completed GitHub release process");
  } else if (!(await createGitHubRelease())) {
    // The tag is already pushed; fail the command so the missing GitHub
    // Release doesn't go unnoticed.
    process.exitCode = 1;
  }
};
