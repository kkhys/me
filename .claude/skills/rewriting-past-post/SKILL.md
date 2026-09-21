---
name: rewriting-past-post
description: >-
  Migrate a post from the old blog into apps/me/me-content as
  blog/<original date>/index.mdx in the current writing style — rules from
  me-content/.claude/rules/blog-writing-style.md, facts re-checked as of the
  original date with verified source links, images commented out until the
  user supplies them, then placed as a 01.jpg sequence.
when_to_use: >-
  Whenever the user pastes an old article — "昔、〜という記事を書きました",
  "過去に書いた記事のリライト", "今の書き方や構成に直して" — drops images into
  a rewritten post's directory ("画像を追加しました。適切に配置して"), or asks
  to turn the rewritten posts in git diff into drafts.
argument-hint: "[pasted old article | post directory that just received images]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - WebFetch
  - Bash(bun:*)
  - Bash(git:*)
  - Bash(mv:*)
  - Bash(rm:*)
  - Bash(ls:*)
  - Bash(date:*)
---

# Rewriting a Past Post

## Input

$ARGUMENTS

A pasted old article arrives with its old header — title, publish date, a
one-letter category (`t` is Tech), emoji, a numeric slug — or as a title
followed by two dates (`2020.06.02  2020.09.08`: published, updated). A
directory path means the user has just dropped images there.

## Where things live

- Posts: `apps/me/me-content/blog/<YYYY-MM-DD>/index.mdx`. `me-content` is
  a submodule checked out on `main`.
- Style: `apps/me/me-content/.claude/rules/blog-writing-style.md`. Read it
  before writing; it governs every sentence, and this skill adds only what
  it does not say.
- Tags: `apps/me/src/features/blog/config/tag.ts`, scoped per category.
- Tone reference: two or three 2025–2026 posts of the same category
  (`Glob apps/me/me-content/blog/2026-*/index.mdx`), and the neighbouring
  entries of the same series when the old post belongs to one.

## Write the post

1. Directory: the old publish date, as written in the header (the date
   part, no timezone conversion). Never today's date, and never the old
   "updated" date.
2. Frontmatter:
   - `title`: may be recast in the current style (「【製作日記1.0】オーダー
     メイドパーカーの裁断まで。」→「オーダーメイドのパーカー｜材料と裁断編」).
   - `emoji`: match the neighbouring posts of the same series or category.
   - `category`: by content. `tags`: only titles present in `tag.ts`; a new
     tag is added there in the same change.
   - `status`: `published` unless the user says draft.
   - `publishedAt`: the directory date. `updatedAt`: today
     (`date +%Y-%m-%d`).
   - `slug`: a hash of `publishedAt`, never the old numeric slug:

     ```bash
     cd apps/me && bun -e 'import { generateBech32m } from "./src/utils/hash.ts"; console.log(generateBech32m("<YYYY-MM-DD>", "b"))'
     ```

3. Body: rewrite for the article's theme, not line by line. Keep what the
   post is about, drop what was padding, add the context a reader needs for
   the point to land. Length is whatever the content needs.
   - Facts as of the original date. A 2021 tech post describes 2021 tools;
     check each claim against sources from that time and link them. Fetch
     every link before keeping it — a dead or wrong link is worse than none.
   - No era commentary: nothing about 「初代ブログを運用していた頃」, no
     archival `> [!WARNING]` block about the post being old (these were
     removed from every post in August 2026), and no 「YYYYMMDD追記」 for the
     rewrite itself.
   - Series posts link the previous entry by full URL
     `https://kkhys.me/blog/posts/<slug>` on its own line.
   - Sewing posts (DIY, tag Sewing): few footnotes, no glossary asides.
4. Images: the old post's images are not in the repository yet. Write each
   image line where it belongs, commented out so `astro build` does not
   fail on a missing file, numbered in reading order, with a caption in the
   article's voice:

   ```mdx
   {/* ![前身頃のパターン](./01.jpg "前身頃") */}
   ```

## When images arrive

The user copies raw files (`IMG_E0861.jpg` …) into the post directory:

1. Read every image; the Read tool shows it. Decide which one belongs to
   which commented line. Files that fit nowhere are deleted, not kept.
2. `mv` the chosen files to `01.jpg`, `02.jpg` … in text order, keeping the
   original extension, and renumber the commented lines to match.
3. Uncomment the lines that now have a file. A line with no matching image
   stays commented; name those in the report.
4. EXIF is stripped by the me-content lefthook on commit; nothing to do by
   hand.

## Drafts

「全て draft にして」 on rewritten posts still in `git diff`: set
`status: draft` in each, nothing else.

## Commit

Only when the user asks. Inside `apps/me/me-content` (main, pushed directly,
no PR): `post(blog): publish <topic> article` with a body saying it was
migrated from the old blog and what was reorganized or added; drafts are
`post(blog): add <topic> draft`; later edits `fix(blog): …`. Push, then in the
repository root commit the pointer as `chore(me): update me-content submodule`
and push main.

## Report

Path written, the title / emoji / tags chosen, what was corrected against
sources, and which image lines are still commented out.
