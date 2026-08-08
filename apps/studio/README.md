# Studio

Local-only browser app for composing memos into `apps/memo/memo-content`.
Never deployed: it runs on the developer's machine and writes directly to
the content submodule.

## Usage

```bash
pnpm dev:studio   # from the repo root; binds to 127.0.0.1:5757
```

The UI provides a compose form (body, tag, reply/quote, draft flag,
images), a searchable feed of existing memos, and a sync button that
commits and pushes memo-content (optionally triggering the deploy
workflow).

Body length is validated like the memo app (rendered text ≤ 500 chars),
and all API routes are guarded against DNS rebinding / cross-origin
requests.

See [CLAUDE.md](./CLAUDE.md) for the codebase map and API details.
