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

## TypeScript

- Strict mode enabled, target ESNext
- Path alias: `~/*` → `./src/*`
- Use `@ts-expect-error` (not `@ts-ignore`) for intentional type violations

## Testing

- Vitest with `@solidjs/testing-library` and `happy-dom` environment
- Add `// @vitest-environment happy-dom` directive to test files
- Wrap components using router links in `<Router>` during tests
