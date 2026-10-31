---
name: enabling-auto-merge
description: >-
  Hand the current branch's pull request to GitHub auto-merge: mark it ready
  for review and enable auto-merge with a merge commit, so the `main` ruleset
  merges it the moment the CI check passes. Last step after creating-pr in
  this repo; never for Renovate or the memo submodule PRs, which merge
  themselves.
when_to_use: >-
  Right after creating-pr opens a PR here, and whenever the user wants a PR to
  land on its own — "自動マージして", "CI 通ったらマージ", "auto-merge",
  "オートマージ", "マージまでやって".
allowed-tools:
  - Bash(gh:*)
  - Bash(git:*)
---

# Enabling Auto-Merge

The `main` ruleset requires the CI check `Lint, Test, Type check & Build`, so
no PR can merge before it passes. Auto-merge lets GitHub perform the merge the
instant it does. Draft PRs are never auto-merged, so the PR is marked ready
first.

## Current PR

!`gh pr view --json number,url,isDraft,autoMergeRequest,mergeStateStatus --jq '"#\(.number) \(.url) draft=\(.isDraft) auto=\(.autoMergeRequest != null) state=\(.mergeStateStatus)"' 2>/dev/null || echo "No open PR for the current branch"`

## Steps

1. The branch is final. Auto-merge stays armed across later pushes by the
   author, so every follow-up commit merges on green with no further review —
   push any pending fix before enabling, and skip this skill while the user is
   still iterating on the branch.

2. Mark the PR ready and enable auto-merge with a merge commit:

   ```sh
   gh pr ready
   gh pr merge --auto --merge
   ```

   `--merge`, not `--squash`: the branch history is kept on `main`. Branch
   deletion is a repository setting, so no `--delete-branch`.

3. Confirm `gh pr view --json autoMergeRequest` is non-null, then report the
   PR URL and that it merges once CI passes. A `skip-ci` PR reports its check
   as skipped, which the ruleset accepts, so it merges as soon as the workflow
   finishes.

## When the enable fails

- "Pull request is in clean status" — CI already passed and nothing blocks
  the merge. Merge directly: `gh pr merge --merge`.
- Any other error — report it verbatim and stop. Bypassing the ruleset with
  `--admin` is the user's call, never the default.

To watch the PR until it lands, hand off to babysitting-pr.
