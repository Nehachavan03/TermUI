# Changelog

All notable changes to TermUI are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/).

---

## [0.1.2] — Unreleased

### Fixed

- **JSX `useInterval`** no longer creates duplicate timers on re-render. Re-renders update the callback ref instead of spawning a new `setInterval`.
- **JSX `useEffect`** cleanup tracking rewritten. Effects update existing records in-place on re-render. Cleanups run before the effect re-executes.
- **JSX reconciler** memory leak fixed. Old widgets are deleted from `_instanceMap` when a component re-renders, preventing the map from growing forever.
- **`@termuijs/data` `tail.ts`** file descriptor leak fixed. `fs.closeSync(fd)` now runs inside a `try/finally` block.
- **`@termuijs/data` `tail.ts`** watcher cleanup fixed. `stop()` now calls `fs.unwatchFile()` immediately instead of waiting for the next change event.
- **`@termuijs/data` `cpu.ts`** double-call inconsistency fixed. Added a cached delta with a short TTL so `cpu.percent` and `cpu.perCore` return data from the same sample.
- **`@termuijs/data` `disk.ts`** macOS percent column detection fixed. Column index is now `7` on macOS and `4` on Linux (was `4` for both).
- **`@termuijs/data` `http.ts`** response body now consumed with `await res.text()` to prevent connection leaks.
- **`@termuijs/router`** history no longer grows unbounded. Added `maxHistory` option (defaults to 100). The array is trimmed with `slice()` on each push.
- **`@termuijs/tss` watcher** no longer uses `require()` in ESM. `readdirSync` is imported at the top of the file alongside other `node:fs` imports.
- **`@termuijs/tss` watcher** `_reload` now calls `loadAll()` to re-merge all `.tss` sources instead of replacing the stylesheet with a single file.
- **`@termuijs/tss` engine** `_parseColor` now delegates to `parseColor()` from `@termuijs/core` instead of duplicating a limited subset of color parsing.
- **`@termuijs/ui`** all 9 compound widgets (Select, MultiSelect, Tabs, Modal, Toast, Tree, Form, CommandPalette, ConfirmDialog) now call `markDirty()` in every state-mutating method.
- **`@termuijs/ui` Form** submit button navigation separated from field navigation. `markDirty()` added to `nextField()` and `prevField()`.
- **`@termuijs/ui` Modal** no longer accesses private `_rect` and `_renderSelf` on content widgets.

### Changed

- **Documentation overhaul.** 15 doc pages rewritten to match actual APIs. Removed wrong constructors (`new Style()`, `new Layout()`, `new App()`), phantom methods (`beforeEach`, `onRoute`, `parse`), and incorrect theme names.
- **`@termuijs/data` description** corrected across README, `package.json`, website, and docs — from "reactive data sources" to "system monitoring: CPU, memory, disk, network, processes."
- **`@termuijs/tss` `package.json`** and README updated from "five built-in themes" to "six" (Solarized was missing from the list).
- **Router README** fixed dynamic route syntax from `:id` to `[id]`.
- **Root README** test badge updated from 307 to 356. Removed `**NEW**` and `← NEW` badges. Fixed `app.onKey()` → `app.events.on('key')`.
- **Website navigation** rewritten. Removed 9 dead sidebar links. Added missing sections for Store, Testing, JSX, Quick, Unicode.
- **Website package cards** added `@termuijs/store` and `@termuijs/testing`. Fixed `@termuijs/data` description.

### Added

- **`@termuijs/quick` documentation** — new page covering reactive values, widget shorthands, layout helpers, and the fluent `AppBuilder`.
- **String utilities documentation** — new page covering `stringWidth`, `truncate`, `wordWrap`, `stripAnsi`.
- **Tests** — 49 new tests across store, data, quick, jsx (hooks, context, memo), and create-termui-app. Total: 356 tests, 44 test files, all packages building.

---

## [0.1.1] — 2026-02-14

### Added

- **13 packages** published to npm for the first time under the `@termuijs` scope.
- **`@termuijs/core`** — screen buffer, flexbox layout engine, input parser, event emitter, focus manager, ANSI rendering, CJK-aware string utilities.
- **`@termuijs/widgets`** — Box, Text, Table, ProgressBar, Spinner, Gauge, TextInput, VirtualList.
- **`@termuijs/ui`** — Select, MultiSelect, Tabs, Modal, Toast, Tree, Form, CommandPalette, ConfirmDialog, Divider.
- **`@termuijs/jsx`** — TSX runtime with `useState`, `useEffect`, `useRef`, `useContext`, `useAsync`, `useInput`, `useInterval`, `useMemo`, and `memo()`.
- **`@termuijs/store`** — Zustand-style global state with `createStore`, selectors, `subscribe`, `destroy`.
- **`@termuijs/tss`** — Terminal Style Sheets with variables, selectors, pseudo-classes, and 6 built-in themes (default, cyberpunk, nord, dracula, catppuccin, solarized).
- **`@termuijs/router`** — screen routing with `[id]` dynamic params, history stack, navigation events, file-based route scanning.
- **`@termuijs/motion`** — `stepSpring()`, `animateSpring()`, spring presets (default, stiff, gentle, wobbly, slow, molasses), easing functions, transitions.
- **`@termuijs/data`** — CPU, memory, disk, network, process monitoring. File tailing. HTTP ping.
- **`@termuijs/testing`** — in-memory test renderer with `render()`, `getByText()`, `getAllByType()`, `fireKey()`, `typeText()`, `lastFrame()`, `toString()`.
- **`@termuijs/dev-server`** — file-watching hot-reload via `child_process.fork()`.
- **`@termuijs/quick`** — fluent builder API for rapid prototyping. `app()`, `gauge()`, `table()`, `text()`, `sparkline()`.
- **`create-termui-app`** — project scaffolding CLI with template selection.
- **5 examples** — dashboard, jsx-dashboard, showcase, system-monitor, todo-app.
- **6 built-in themes** — default, cyberpunk, nord, dracula, catppuccin, solarized.
- **Documentation website** — built with Vite + TanStack Router.

---

## [0.1.0] — 2026-02-10

### Added

- Initial framework scaffold with core architecture.
- Scope renamed from `@termui` to `@termuijs`.
