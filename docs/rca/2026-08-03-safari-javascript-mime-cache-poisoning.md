# RCA: Blank screen from HTML cached at JavaScript asset URLs

## Summary

After the v0.12.0 deployment, some cached documents referenced JavaScript bundle hashes that were no longer
available in the active Cloudflare Pages deployment. Missing `/_build/*` requests were allowed to reach the SSR
Function, which returned the site HTML with `200 OK` at a JavaScript URL. The asset cache rule then made that HTML
response immutable for one year, and Safari refused to execute it because its MIME type was `text/html`.

The application code in v0.12.0 changed bundle hashes and exposed the defect, but it did not generate the invalid
MIME response. The underlying defect was an incomplete boundary between static build assets and SSR routing.
The outage initially affected both Safari and non-Safari browsers. A “Purge Everything” performed while v0.12.0
was still deployed restored all tested non-Safari browsers, but Safari remained broken. The routing fix then shipped
in v0.12.1, preventing new invalid responses. A second “Purge Everything” after that release restored Safari on the
MacBook and iPad; the iPhone required a separate local website-data clear.

- **Incident date:** 2026-08-02 through 2026-08-03 (America/New_York)
- **Affected release:** v0.12.0
- **Detection:** Manual post-deploy smoke test, approximately one minute after release
- **Code remediation:** v0.12.1
- **Operational remediation:** Initial purge on v0.12.0, post-fix purge on v0.12.1, and an iPhone website-data clear
- **Severity:** P1 — production was initially unusable across browsers and persisted on affected Safari sessions
- **Data impact:** None

## Symptom

Affected sessions displayed a blank page. Safari logged repeated unhandled promise rejections:

```text
TypeError: 'text/html' is not a valid JavaScript MIME type.
```

The break was initially widespread. During the Linux investigation, the first full Cloudflare cache purge—while
v0.12.0 was still deployed—restored all tested non-Safari browsers. Safari remained broken across a MacBook, iPad,
and iPhone, which narrowed the continuing incident to Safari. After the fix had shipped in v0.12.1, a second full
Cloudflare cache purge restored the MacBook and iPad. On the iPhone, a private tab worked after the second purge,
but the normal tab remained broken until the site's Safari website data was cleared.

### Reproduction Steps

Before the fix:

1. Load HTML that references a removed or otherwise unavailable hashed asset under `/_build/assets/`.
2. Request the missing `.js` URL from the active Cloudflare Pages deployment.
3. Observe the request fall through to the SSR Function.
4. Observe `200 OK`, `Content-Type: text/html`, and an immutable one-year cache policy on the `.js` URL.
5. Reload the document in a browser session that retained the response.

### Observed Behavior

Production inspection before the fix showed:

| Request                   | Status | Content-Type             | Cache-Control                         |
| ------------------------- | ------ | ------------------------ | ------------------------------------- |
| Existing hashed bundle    | `200`  | `application/javascript` | `public, max-age=31536000, immutable` |
| Missing/old hashed bundle | `200`  | `text/html`              | `public, max-age=31536000, immutable` |

Safari correctly rejected the second response before JavaScript execution.

### Expected Behavior

An existing bundle must be returned as JavaScript. A missing bundle must return a non-cacheable `404` and must
never fall through to the HTML renderer.

## Root Cause

### Code Location

- `vite.config.ts`: Nitro's Cloudflare Pages configuration
- Generated artifact: `dist/_routes.json`
- Generated cache rules: `dist/_headers`

### Analysis

Nitro generated a Pages `_routes.json` that excluded the static files present in that specific build. It did not
exclude the complete `/_build/*` namespace. This worked while a request matched one of the generated filenames,
but a stale or missing hash was absent from the exclusion list and therefore invoked the catch-all SSR Function.

The failure chain was:

1. v0.12.0 changed client bundle contents and hashes. The package version is compiled into the homepage bundle,
   and the release also changed SEO and background code.
2. A stale document or cache entry referenced a hash that was not present in the active deployment.
3. The missing path did not match an exact static-file exclusion in `_routes.json`.
4. The request invoked the SSR Function, which treated it as an application route and rendered the homepage HTML
   with `200 OK`.
5. The `/_build/assets/*` cache rule attached `public, max-age=31536000, immutable` to the response even though it
   was HTML rather than JavaScript.
6. CDN and browser caches could retain the invalid representation at the `.js` URL.
7. Safari rejected the HTML response as a JavaScript module, preventing the affected route chunk from loading and
   leaving the page blank.

The Open Graph constants added in v0.12.0 were ruled out as a root cause. They only produce meta-tag strings after
a module has loaded. A browser validates a module's HTTP MIME type before executing its code. The SEO change could
change a bundle hash and therefore help trigger the stale-asset path, but it could not make Cloudflare return HTML
for a JavaScript request.

## Why Recovery Differed by Device

The observed recovery sequence distinguishes the active routing defect from CDN and browser persistence:

1. **Active v0.12.0 defect:** The first “Purge Everything” cleared enough poisoned state to restore all tested
   non-Safari browsers, but it occurred before the routing defect was fixed and therefore could not prevent the bad
   response from being generated again.
2. **Cloudflare/CDN state after the fix:** Deploying v0.12.1 stopped new poisoned responses but did not evict every
   existing one. The second “Purge Everything” restored Safari on the MacBook and iPad.
3. **Local Safari website data:** After the second purge, an iPhone private tab worked while its normal tab did not.
   This showed that the active deployment and CDN path were healthy, while the normal Safari profile still retained
   stale site data. Clearing the site's website data restored the normal tab.

The incident does not demonstrate a Safari JavaScript-engine incompatibility. Safari's longer persistence was a
cache-state difference. The precise internal cache tier used by each Safari device was not instrumented.

## Contributing Factors

- [x] **Configuration error:** Static asset exclusions described only files in the current build, not the stable
      asset namespace.
- [x] **Edge case not considered:** Negative requests for removed hashed assets were not tested.
- [x] **Cache policy amplified impact:** A path-based immutable rule also applied to the SSR fallback response.
- [x] **Release hash churn exposed the defect:** v0.12.0 produced new bundle URLs while stale documents could still
      reference older URLs.
- [x] **Automation gap:** Manual post-deploy testing caught the incident within approximately one minute, but no
      automated production probe asserted that a nonexistent `.js` URL returned `404` rather than HTML.
- [x] **Recovery gap:** The incident runbook did not distinguish CDN purge from per-device website-data clearing.
- [x] **Purge sequencing:** The first full purge occurred while v0.12.0 was still active. It restored non-Safari
      browsers but left the faulty routing path able to generate and cache the response again.

## Fix Approach

The fix explicitly excludes the entire `/_build/*` namespace from Cloudflare Pages Functions. Existing build assets
remain static, while a missing build asset is handled by the static asset layer and cannot reach SSR.

The code fix and the cache purges addressed different parts of the incident. The first purge temporarily restored
non-Safari browsers but ran before the defect was fixed. v0.12.1 stopped future missing-asset requests from
generating cacheable HTML, while the second full purge removed invalid responses created before the fix. Deploying
v0.12.1 alone was therefore necessary but not sufficient to restore already-affected sessions.

Cloudflare documents this directory-level exclusion pattern in its
[Pages Functions routing documentation](https://developers.cloudflare.com/pages/functions/routing/).

### Changes

| File                                     | Change                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| `vite.config.ts`                         | Added `cloudflare.pages.routes.exclude: ["/_build/*"]`.  |
| `tests/build/cloudflare-routing.test.ts` | Added a regression assertion for the wildcard exclusion. |

The fix was introduced by commit
[`58291c2`](https://github.com/Jakob-Strobl/portfolio/commit/58291c2c96da3440cb7a5f049a9b0124af9fccf0)
and released in v0.12.1 through
[#76](https://github.com/Jakob-Strobl/portfolio/pull/76).

### Risks

All URLs under `/_build/*` now bypass the SSR Function. This is intentional because that namespace is reserved for
generated static assets. A future dynamic endpoint must not be placed under that prefix.

## Validation

- The focused routing regression test passed.
- The full suite passed: 281 tests across 20 files.
- The production build completed and generated `dist/_routes.json` with `"/_build/*"` in `exclude`.
- The first full purge on v0.12.0 restored all tested non-Safari browsers but did not restore Safari.
- v0.12.1 was deployed before the second purge, but affected Safari sessions remained broken until that purge.
- That second, post-release purge restored Safari on the MacBook and iPad.
- An iPhone private tab worked; clearing website data then restored the normal iPhone tab.
- Post-fix production verification of a nonexistent bundle returned:

```text
HTTP/2 404
cache-control: no-store
cf-cache-status: BYPASS
content-length: 0
```

This verifies that a missing build asset no longer returns or caches SSR HTML.

## Prevention

### Completed Actions

- [x] Exclude the complete `/_build/*` namespace from Pages Functions.
- [x] Add a regression test for the wildcard exclusion.
- [x] Purge the poisoned Cloudflare cache.
- [x] Verify recovery across macOS Safari, iPadOS Safari, and iOS Safari.
- [x] Verify the negative asset path in production after deployment.

### Follow-up Actions

- [ ] Add a post-deployment smoke test that requests a guaranteed-missing `/_build/assets/*.js` URL and requires a
      non-cacheable `404` with no HTML body.
- [ ] Alert on JavaScript requests returning an HTML MIME type or a successful HTML response.
- [ ] Document the recovery order: fix routing, deploy, purge CDN, test a private session, then clear website data
      only on profiles that remain affected.
- [ ] Carry the same invariant into the planned Workers migration. Workers Static Assets also send missing assets
      to the Worker by default, so `/_build/*` misses must explicitly return `404` rather than SSR HTML.

## Timeline

| Event                                   | Date and time (EDT)  | Notes                                                                                       |
| --------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| v0.12.0 released                        | 2026-08-02 23:14     | Release changed client bundle hashes.                                                       |
| Incident detected                       | ~2026-08-02 23:16    | Manual post-deploy smoke testing found a widespread cross-browser failure.                  |
| Linux investigation started             | Shortly after 23:16  | Investigation continued on Linux while the failure still affected non-Safari browsers.      |
| First full cache purge                  | During Linux work    | Purge ran on v0.12.0 and restored all tested non-Safari browsers.                           |
| Persistent Safari impact identified     | After first purge    | Safari remained broken, narrowing the continuing incident to Safari sessions.               |
| Codex investigation started             | After Safari scoping | This session began once Linux could no longer reproduce the remaining Safari-only behavior. |
| Incident reproduced and investigated    | 2026-08-02 23:55     | Missing `.js` request confirmed as `200 text/html` with one-year immutable caching.         |
| Routing fix committed                   | 2026-08-03 00:08     | Commit `58291c2` added the wildcard exclusion and regression test.                          |
| v0.12.1 released                        | 2026-08-03 00:30     | Fix shipped through release PR #76.                                                         |
| Second full purge and recovery verified | 2026-08-03           | Post-v0.12.1 purge restored Safari on MacBook and iPad.                                     |
| Local iPhone recovery verified          | 2026-08-03           | Private tab worked; clearing website data restored the normal tab.                          |
| Negative production path verified       | 2026-08-03 00:52     | Missing bundle returned `404`, `no-store`, and `BYPASS`.                                    |

## Related

- Fix commit: [`58291c2`](https://github.com/Jakob-Strobl/portfolio/commit/58291c2c96da3440cb7a5f049a9b0124af9fccf0)
- Release PR: [#76](https://github.com/Jakob-Strobl/portfolio/pull/76)
- Release: [v0.12.1](https://github.com/Jakob-Strobl/portfolio/releases/tag/v0.12.1)
- Cloudflare Pages routing:
  [Functions invocation routes](https://developers.cloudflare.com/pages/functions/routing/)
