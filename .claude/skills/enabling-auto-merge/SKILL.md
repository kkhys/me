---
name: enabling-auto-merge
description: >-
  Hand the current branch's pull request to GitHub's merge queue: mark it ready
  for review and enable auto-merge, so the `main` ruleset queues the PR the
  moment its checks pass and merges it with a merge commit once the queue's
  own run is green. Last step after creating-pr in this repo; never for
  Renovate or the memo submodule PRs, which queue themselves.
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
`Verify actions.lock`, and CodeQL results, and merges only through a merge
queue. Auto-merge adds the PR to the queue the instant its own checks pass;
the queue re-runs the checks on main plus the PR and merges with a merge
commit. Draft PRs are never auto-merged, so the PR is marked ready first.

## Current PR

!`gh pr view --json number,url,isDraft,autoMergeRequest,mergeStateStatus --jq '"#\(.number) \(.url) draft=\(.isDraft) auto=\(.autoMergeRequest != null) state=\(.mergeStateStatus)"' 2>/dev/null || echo "No open PR for the current branch"`

## Steps

1. The branch is final. Auto-merge stays armed across later pushes by the
   author, so every follow-up commit queues on green with no further review —
   push any pending fix before enabling, and skip this skill while the user is
   still iterating on the branch.

2. Mark the PR ready and enable auto-merge:

   ```sh
   gh pr ready
   gh pr merge --auto --merge
   ```

   The queue decides the merge method (a merge commit, so the branch history
   is kept on `main`); `--merge` only satisfies gh's flag check. Branch
   deletion is a repository setting, so no `--delete-branch`.

3. Confirm `gh pr view --json autoMergeRequest` is non-null, then report the
   PR URL and that it merges once the queue's run passes. An entry whose
   queue run fails is dropped from the queue without merging: fix the branch,
   push, and the still-armed auto-merge re-queues it on green.

## When the enable fails

- "Pull request is in clean status" — the PR is already mergeable. Queue it
  directly: `gh pr merge --merge`.
- Any other error — report it verbatim and stop. Bypassing the ruleset with
  `--admin` is the user's call, never the default.

To watch the PR until it lands, hand off to babysitting-pr.
