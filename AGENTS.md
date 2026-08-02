# AGENTS.md

## Build/Test Commands

- `bun run dev` - Start development server
- `bun run build` - Production build
- `bun run test` - Run all tests once
- `bun run test-watch` - Run tests in watch mode
- `bun vitest run tests/example.test.tsx` - Run single test file
- `bun run pretty-check` / `bun run prettify` - Check/fix formatting

## Code Style

- **Framework:** SolidJS with SolidStart, Tailwind CSS v4
- **Imports:** External packages first, then `~/` path aliases, then relative imports
- **Files:** kebab-case (`gallery-photo.tsx`), **Components:** PascalCase, **Functions:** camelCase
- **Types:** PascalCase, prefer `type` over `interface` for simple types
- **Constants:** UPPER_SNAKE_CASE
- **Formatting:** Prettier with 120 char line width
- **Components:** Default exports, props interfaces defined inline above component
- **Error handling:** try/catch with `console.error`, null checks with `== null`
- **Routes:** SolidStart conventions (`(group).tsx`, `[param].tsx`, `+data.tsx`)

## Commit & Release Conventions

- Use Conventional Commits. Prefer a scope when it clarifies the affected area, such as `copy(experience): refine project descriptions`.
- **`feat`:** New user-facing capability; generates a Features entry and a minor release before 1.0.
- **`fix`:** Broken behavior corrected; generates a Bug Fixes entry and a patch release.
- **`perf`:** Performance improvement; generates a Performance Improvements entry.
- **`deps`:** Dependency update; generates a Dependencies entry.
- **`revert`:** Reverts a previous change; generates a Reverts entry.
- **`copy`:** User-facing website copy and content, including experience descriptions, project summaries, headings, and positioning; generates a Content entry.
- **`docs`:** Project documentation, such as README files, setup guides, and technical documentation; generates a Documentation entry.
- **`style`:** Formatting or code-style-only changes; generates a Styles entry.
- Release Please uses `release-please-config.json` for release behavior and changelog sections, while `.release-please-manifest.json` stores released versions. The workflow uses manifest configuration rather than passing `release-type` directly.
- Visible non-feature, non-breaking commit types use the default patch-release behavior, so `copy`, `docs`, and `style` commits can create patch releases as well as release-note entries.

## TypeScript

- Strict mode enabled, target ESNext
- Path alias: `~/*` → `./src/*`
- Use `@ts-expect-error` (not `@ts-ignore`) for intentional type violations

## Testing

- Vitest with `@solidjs/testing-library` and `happy-dom` environment
- Add `// @vitest-environment happy-dom` directive to test files
- Wrap components using router links in `<Router>` during tests
