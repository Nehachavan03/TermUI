# Contributing to TermUI

Thanks for considering a contribution. Whether it's a bug fix, a new widget, improved docs, or a typo — it all helps.

## Getting started

```bash
git clone https://github.com/Karanjot786/TermUI.git
cd TermUI
pnpm install
pnpm run build
pnpm test
```

You need Node.js 18+ and pnpm. The project is a pnpm workspace monorepo with 13 packages under `packages/`.

## Project structure

```
packages/
  core/              Screen buffer, layout engine, input, events
  widgets/           Box, Text, Table, ProgressBar, Spinner, Gauge, VirtualList
  ui/                Select, Tabs, Modal, Toast, Tree, Form, CommandPalette
  jsx/               TSX runtime with hooks
  store/             Global state management
  tss/               Terminal Style Sheets
  router/            Screen routing
  motion/            Spring animations
  data/              System monitoring (CPU, memory, disk, processes)
  testing/           In-memory test renderer
  dev-server/        Hot-reload dev server
  quick/             Fluent builder API
  create-termui-app/ Project scaffolding CLI
website/             Documentation site (Vite + TanStack Router)
examples/            Working example apps
```

## Before you write code

1. **Check existing issues.** Someone might already be working on it.
2. **Open an issue first** for anything larger than a small fix. Describe what you want to change and why. This saves everyone time if the approach needs discussion.
3. **One pull request per change.** Don't bundle unrelated fixes together.

## Writing code

### Style

- TypeScript strict mode. No `any` unless absolutely unavoidable (and if you use it, leave a comment explaining why).
- No external runtime dependencies in `@termuijs/core`. The core must stay dependency-free.
- Use `node:` prefix for built-in modules (`import { readFileSync } from 'node:fs'`).
- Every state-mutating method on a widget must call `this.markDirty()`.

### Tests

Every package uses [Vitest](https://vitest.dev/). Tests live next to source files (`foo.ts` → `foo.test.ts`).

```bash
# Run all tests
pnpm test

# Run tests for a single package
pnpm vitest run packages/core

# Watch mode
pnpm test:watch
```

If you're adding a new widget or fixing a bug, add a test. If you don't know how to test something, look at existing tests in the same package for patterns.

### Building

```bash
# Build all packages
pnpm run build

# Build a single package
cd packages/core && pnpm run build
```

Each package uses tsup. The output goes to `dist/` with both ESM and CJS formats.

### Scratch scripts

The `scratch/` directory has runnable scripts that exercise each package. These are useful for manual testing:

```bash
npx tsx scratch/1-core.ts
npx tsx scratch/5-store.ts
```

If you're fixing a bug, consider writing a scratch script that reproduces it first.

## Pull request process

1. Fork the repo and create a branch from `main`.
2. Make your changes.
3. Run `pnpm run build && pnpm test` — both must pass.
4. Write a clear PR description. Explain *what* changed and *why*.
5. If you're fixing a bug from the issue tracker, reference the issue number.

We'll review within a few days. Small PRs get reviewed faster than large ones.

## What we look for in reviews

- **Does it break existing tests?** If `pnpm test` fails, the PR won't merge.
- **Is there a test for the change?** Bug fixes need a test that would have caught the bug. New features need coverage for the happy path and at least one edge case.
- **Does it match the existing code style?** Read a few files in the same package to get a feel for the patterns.
- **Are there `markDirty()` calls?** Any widget method that changes visible state needs to call `markDirty()` so the render loop picks it up.
- **Is the commit message clear?** Use the format: `fix(core): prevent layout overflow on zero-width box` or `feat(widgets): add BarChart widget`.

## Commit message format

```
type(scope): short description

Longer explanation if needed.

Fixes #123
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`

Scopes: `core`, `widgets`, `ui`, `jsx`, `store`, `tss`, `router`, `motion`, `data`, `testing`, `dev-server`, `quick`, `create-termui-app`, `website`

## Adding a new widget

1. Create the file in the right package (`packages/widgets/src/` for base widgets, `packages/ui/src/` for compound ones).
2. Extend the `Widget` base class from `@termuijs/core`.
3. Implement `_renderSelf(screen: Screen)`.
4. Call `this.markDirty()` in every method that changes visual state.
5. Export from the package's `index.ts`.
6. Add tests.
7. Add a doc page in `website/src/content/` and register it in `pages.ts`.

## Adding a new theme

1. Create a `.tss` file in `packages/tss/src/themes/`.
2. Add the theme name to `BUILTIN_THEMES` in `packages/tss/src/themes/index.ts`.
3. Update the theme count in `packages/tss/package.json` and `packages/tss/README.md`.
4. Update the TSS docs page.

## Questions?

Open an issue or start a discussion. There are no stupid questions — the codebase has 13 packages and a lot of moving parts. Asking first is always better than guessing.
