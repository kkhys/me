---
name: labeling-pr
description: >-
  Give the current branch's pull request its one `type: *` label, derived
  from the Conventional Commits type in its title. Runs between creating-pr
  and enabling-auto-merge in this repo.
when_to_use: >-
  Right after creating-pr opens a PR here, after a PR's title changes type,
  and whenever the user asks for labels — "ラベル付けて", "ラベル設定",
  "label the PR".
allowed-tools:
  - Bash(gh:*)
---

# Labeling PR

Every PR in this repo carries exactly one `type: *` label from the moment it
opens. PRs from Renovate (`type: bump-version`) and `sync-submodule.yml`
(`type: submodule`) arrive labelled; leave those as they are.

## Current PR

!`gh pr view --json number,url,title,labels --jq '"#\(.number) \(.url) title=\"\(.title)\" labels=[\([.labels[].name] | join(", "))]"' 2>/dev/null || echo "No open PR for the current branch"`

## Available labels

!`gh label list --search "type:" --limit 100 --json name,description --jq '.[] | "- \(.name) — \(.description)"' 2>/dev/null || echo "Could not list labels; run gh label list"`

Labels are declared in `.github/labels.yml` (extending `kkhys/.github`), and
`sync-labels.yml` prunes every label not declared there. A label missing
from the list above belongs in that file, not in `gh label create`.

## Steps

1. Pick the label. The title's Conventional Commits type maps one to one:
   `[main] feat: ...` takes `type: feat`. A PR whose purpose is a submodule
   pointer update takes `type: submodule` in place of `type: chore`.

2. Apply it. When the PR already carries a different `type: *` label, swap
   it in the same call:

   ```sh
   gh pr edit --add-label "type: feat"
   gh pr edit --add-label "type: fix" --remove-label "type: feat"
   ```

3. Confirm `gh pr view --json labels` shows exactly one `type: *` label, then
   report it with the PR URL.
