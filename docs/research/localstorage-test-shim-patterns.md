# `localStorage` test shim patterns

_Research date: 2026-08-21_

## Scope

This note records how to make the portfolio's browser-storage tests reliable under the current
Vitest, happy-dom, Bun, and Node CI setup. The implementation follows the test-only pattern
recommended below; application source remains unchanged.

## Repository findings

- [`vitest.config.ts`](../../vitest.config.ts) uses Vitest's `happy-dom` environment with
  `globals: true` and registers a shared browser-storage setup file.
- The project pins Vitest `4.1.10`, happy-dom `20.11.1`, Bun `1.3.14`, and requires Node 24+
  in [`package.json`](../../package.json).
- [`background.tsx`](../../src/providers/background.tsx) correctly uses the browser-owned
  `window.localStorage` API. The application should not grow a test-only fallback.
- [`background-settings.test.tsx`](../../tests/components/background-settings.test.tsx) uses
  `window.localStorage` in suite hooks and test bodies. The current failure is that
  `window.localStorage` is `undefined` in this Vitest run, not that the application storage
  logic is failing.
- A direct happy-dom `Window` has an in-memory `localStorage`, but Vitest's happy-dom
  environment projects selected window properties onto its test global. The installed
  Vitest runtime does not reliably project `localStorage` for this setup. This is why the
  browser-like environment exists while this one API is still missing.

## What the platform provides

Vitest documents `happy-dom` as a DOM environment and supports `setupFiles` for code that must
run before test files are collected. It separately recommends `beforeEach`/`afterEach` for
resetting mutable state. See [Vitest environments](https://vitest.dev/guide/environment.html)
and [Vitest setup and teardown](https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md).

happy-dom's `Window` creates a `Storage` instance for each window. Its implementation is an
in-memory store, which is appropriate for deterministic tests but is not a browser persistence
or eventing model. See the [happy-dom `BrowserWindow` source](https://github.com/capricorn86/happy-dom/blob/master/packages/happy-dom/src/window/BrowserWindow.ts)
and [Storage source](https://github.com/capricorn86/happy-dom/blob/master/packages/happy-dom/src/storage/Storage.ts).

Node also has a native `localStorage` global, but Node 24 documents it as release-candidate /
experimental Web Storage that requires `--experimental-webstorage`; persistent data is backed
by the file supplied to `--localstorage-file`. That is the wrong primitive for this suite: it
introduces runtime flags, filesystem state, and possible sharing between processes. See the
[Node 24 globals documentation](https://nodejs.org/download/release/latest-v24.x/docs/api/globals.html#localstorage)
and [`--localstorage-file`](https://nodejs.org/download/release/latest-v24.x/docs/api/cli.html#--localstorage-filefile).

## Options considered

| Pattern                            | Benefits                                                                                           | Risks / cost                                                                                                  | Assessment                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Test-only shared `setupFiles` shim | One implementation; available before application modules are collected; scales to future DOM tests | Must be guarded so a `node`-environment test does not accidentally receive browser globals                    | **Recommended**                                              |
| Suite-local setup                  | Smallest scope and least global behavior; explicit in the storage suite                            | Repeated setup if more suites use storage; easy for another test to omit the reset                            | Good fallback if this remains the only storage suite         |
| Production/source fallback         | Can handle a genuine runtime where storage is unavailable                                          | Masks browser/runtime defects, changes production semantics, and couples application code to the test harness | **Do not use for this failure**                              |
| Node `--localstorage-file`         | Uses Node's built-in API                                                                           | Experimental/RC behavior, persistent file state, process sharing, and no `window` relationship                | **Do not use**                                               |
| Replace happy-dom with jsdom       | Another mature DOM implementation                                                                  | Broad test-environment change for a one-API gap; more churn and potentially different rendering behavior      | Not justified                                                |
| `GlobalRegistrator` inside Vitest  | Can install a complete happy-dom window outside a test runner                                      | Replaces the window Vitest owns and can create split DOM constructors/teardown problems                       | Use only for standalone Node scripts, as happy-dom documents |

## Recommendation

Use a small, test-only setup file that installs happy-dom's in-memory `Storage` onto the
existing DOM global, and keep state reset close to the suite that owns the behavior.

The implemented shape is:

```ts
// tests/setup/browser-storage.ts
import { Storage } from "happy-dom";

if (typeof globalThis.window !== "undefined" && typeof globalThis.document !== "undefined") {
  Object.defineProperties(globalThis, {
    localStorage: {
      configurable: true,
      value: new Storage(),
    },
    sessionStorage: {
      configurable: true,
      value: new Storage(),
    },
  });
}
```

Then register it with Vitest's `test.setupFiles`. The DOM guard matters because this repository
has at least one `// @vitest-environment node` test; the shim must not make SSR tests appear to
run in a browser. Installing one storage object per test environment also preserves the normal
per-file environment lifecycle.

The storage-owning suite should reset state per test, preferably with `localStorage.clear()` in
`beforeEach`. A reset is still necessary even though Vitest isolates test files by default:
file isolation prevents module-cache leakage between files, while storage mutations within a
file remain shared mutable state. Use explicit seed data in tests that verify loading behavior.

Do not use Node's native Web Storage, a disk-backed file, a module-level `Map`, or a production
fallback. Do not replace `window` or register a second happy-dom `Window`; Vitest already owns
the DOM lifecycle. `Object.defineProperty` is preferable to direct assignment because browser
storage properties are commonly exposed as accessor/read-only properties and Node's global
Web Storage behavior varies by version and flags.

If future Vitest versions expose `localStorage` correctly, the setup should be reduced or removed
after verifying the suite against the supported Node versions. Until then, the shim makes the
test contract explicit without hiding a production failure.

## Verification

- The focused background-settings and node-environment SSR suites pass: 7 tests passed.
- The full `bun run cloudflare-step-deploy` path passes: 20 test files and 287 tests pass,
  followed by a successful Cloudflare Pages production build.
- The Node-environment SSR test remains isolated from the browser-storage shim.

## Sources

- [Vitest environment guide](https://vitest.dev/guide/environment.html)
- [Vitest setup and teardown guide](https://github.com/vitest-dev/vitest/blob/main/docs/guide/learn/setup-teardown.md)
- [Vitest isolation implementation](https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/runtime/runBaseTests.ts)
- [happy-dom global registrator](https://github.com/capricorn86/happy-dom/wiki/Global-Registrator)
- [happy-dom `BrowserWindow`](https://github.com/capricorn86/happy-dom/blob/master/packages/happy-dom/src/window/BrowserWindow.ts)
- [happy-dom `Storage`](https://github.com/capricorn86/happy-dom/blob/master/packages/happy-dom/src/storage/Storage.ts)
- [Node 24 global Web Storage documentation](https://nodejs.org/download/release/latest-v24.x/docs/api/globals.html#localstorage)
- [Node 24 `--localstorage-file` documentation](https://nodejs.org/download/release/latest-v24.x/docs/api/cli.html#--localstorage-filefile)
- [WHATWG Web Storage specification](https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface)
