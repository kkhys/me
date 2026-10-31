---
name: enabling-auto-merge
description: >-
  Hand the current branch's pull request to GitHub auto-merge: mark it ready
  for review and enable auto-merge with a merge commit, so the `main` ruleset
  merges it the moment its checks pass on an up-to-date branch. Last step
  after creating-pr in this repo; never for Renovate or the memo submodule
  PRs, which merge themselves.
when_to_use: >-
  Right after creating-pr opens a PR here, and whenever the user wants a PR to
  land on its own — "自動マージして", "CI 通ったらマージ", "auto-merge",
  "オートマージ", "マージまでやって".
allowed-tools:
  - Bash(gh:*)
  - Bash(git:*)
---

# Enabling Auto-Merge

The `main` ruleset requires `Lint, Test, Type check & Build`,
`Verify actions.lock`, clean CodeQL results, and a branch that is up to date
with main. Auto-merge lets GitHub merge the instant all of that holds. Draft
PRs are never auto-merged, so the PR is marked ready first. When another PR
lands first, this one falls behind; `update-behind-prs.yml` then merges main
into every auto-merge-armed PR and its checks re-run, so nothing is needed
by hand after enabling.

## Current PR

!`gh pr view --json number,url,isDraft,autoMergeRequest,mergeStateStatus --jq '"#\(.number) \(.url) draft=\(.isDraft) auto=\(.autoMergeRequest != null) state=\(.mergeStateStatus)"' 2>/dev/null || echo "No open PR for the current branch"`

## Steps

1. The branch is final. Auto-merge stays armed across later pushes by the
   author, so every follow-up commit merges on green with no further review —
   push any pending fix before enabling, and skip this skill while the user is
   still iterating on the branch.

2. If the state above is `BEHIND`, the branch was cut from a stale main and
   no push to main will come along to update it. Update it first:

   ```sh
   gh pr update-branch
   ```

3. Mark the PR ready and enable auto-merge with a merge commit:

   ```sh
   gh pr ready
   gh pr merge --auto --merge
   ```

   `--merge`, not `--squash`: the branch history is kept on `main`. Branch
   deletion is a repository setting, so no `--delete-branch`.

4. Confirm `gh pr view --json autoMergeRequest` is non-null, then report the
   PR URL and that it merges once CI passes.

## When the enable fails

- "Pull request is in clean status" — CI already passed and nothing blocks
  the merge. Merge directly: `gh pr merge --merge`.
- Any other error — report it verbatim and stop. Bypassing the ruleset with
  `--admin` is the user's call, never the default.

To watch the PR until it lands, hand off to babysitting-pr.
