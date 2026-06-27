# diary

Photo diary site — [diary.kkhys.me](https://diary.kkhys.me)

## Tech Stack

- [Astro](https://astro.build/) v6 (static site generation)
- TypeScript (strictest mode)
- Vanilla CSS ([kiso.css](https://github.com/kiso-mc/kiso.css) reset + uchu.css OKLCH palette)
- [Cloudflare Pages](https://pages.cloudflare.com/) (hosting)
- [Biome](https://biomejs.dev/) (linter / formatter)

## Getting Started

### Prerequisites

Development tools are managed by [Nix Flake](https://nix.dev/concepts/flakes). Install Nix, then:

```sh
direnv allow
```

This will automatically set up Node.js, pnpm, and Bun.

### Install Dependencies

```sh
pnpm install
```

### Development

```sh
pnpm dev
```

### Build

```sh
pnpm build
```

### Other Commands

| Command | Description |
| --- | --- |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Run Astro check and TypeScript type checking |
| `pnpm lint` | Lint with Biome |
| `pnpm lint:fix` | Lint and auto-fix with Biome |
| `pnpm release` | Create a date-based release tag |
| `pnpm deploy` | Build and deploy to Cloudflare Pages |

## Project Structure

```
src/
  pages/        — Astro pages
  layouts/      — Layout components
  components/   — Reusable components
  styles/       — Global CSS
public/         — Static assets
diary-content/  — Submodule with diary photos
```

## CI

GitHub Actions runs lint, type check, and build on every PR and push to `main`. Add the `skip-ci` label to a PR to skip.

## License

[MIT](LICENSE.md)
