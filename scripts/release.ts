import { $ } from "bun";

const isDryRun = process.argv.includes("--dry-run");

const now = new Date();
const BASE_VERSION = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
let VERSION = BASE_VERSION;

const tags = (await $`git tag`.text())
  .split("\n")
  .filter((t) => t.startsWith(BASE_VERSION));

if (tags.includes(VERSION)) {
  let i = 2;
  while (tags.includes(`${VERSION}-${i}`)) {
    i++;
  }
  VERSION = `${VERSION}-${i}`;
}

console.log(`🔖 Creating tag: ${VERSION}`);
if (isDryRun) console.log("💡 Dry run mode is ON");

const CURRENT_BRANCH = (await $`git rev-parse --abbrev-ref HEAD`.text()).trim();

if (!isDryRun) {
  await $`git checkout main`;
  await $`git pull origin main`;
  await $`git tag -f ${VERSION}`;
  await $`git push origin main`;
  await $`git push -f origin ${VERSION}`;
  await $`git checkout ${CURRENT_BRANCH}`;
  console.log(`✅ Released tag: ${VERSION} and returned to ${CURRENT_BRANCH}`);
} else {
  console.log("🚫 Would checkout main");
  console.log("🚫 Would pull origin main");
  console.log(`🚫 Would tag -f ${VERSION}`);
  console.log("🚫 Would push origin main");
  console.log(`🚫 Would push -f origin ${VERSION}`);
  console.log(`🚫 Would checkout ${CURRENT_BRANCH}`);
  console.log("✅ Dry run completed");
}
