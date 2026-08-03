# RCA: WebGL background flickers during viewport resize

## Summary

The v0.12.1 viewport-sizing fix moved canvas resizing into a dedicated animation frame. That frame could run after
the background animation had rendered, clearing the WebGL drawing buffer immediately before the browser painted it.

## Symptom

Resizing a desktop window caused the background canvas to flash to its fallback color. Continuously resizing could
keep it dark, and mobile browser chrome expansion or collapse could trigger the same behavior while scrolling.

### Reproduction

1. Open a page with the WebGL background enabled.
2. Continuously resize the viewport, or scroll in mobile Safari so the browser chrome changes the viewport height.
3. Observe cleared frames until the viewport stabilizes.

The canvas should remain rendered throughout viewport changes.

## Root Cause

`src/backgrounds/webgl-background.ts` scheduled viewport work with a separate `requestAnimationFrame`. The existing
animation-loop callback was normally queued first, so a frame could execute in this order:

1. Render the WebGL effect.
2. Run the resize callback.
3. Assign `canvas.width` or `canvas.height`, implicitly clearing the drawing buffer.
4. Paint the cleared canvas before the animation loop rendered again.

Continuous resize events repeated that ordering on successive frames. Cleanup-time `cancelAnimationFrame` was not
involved; it only cancelled a pending resize callback when the host was disposed.

## Contributing Factors

- The v0.12.1 tests verified resize deduplication and final dimensions, but not resize-versus-render call order.
- Backing-store resizing and rendering were owned by independent RAF callbacks despite needing to be atomic for paint.

## Fix

Viewport events now set a deduplicated pending-resize flag and invalidate the existing animation loop. The loop
applies pending backing-store dimensions immediately before rendering, so the replacement drawing buffer is filled
within the same callback. The same path also schedules the one required frame in static/reduced-motion mode.

| File                                         | Change                                                             |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `src/backgrounds/webgl-background.ts`        | Consume queued resize work at the start of the render callback.    |
| `tests/backgrounds/webgl-background.test.ts` | Assert single-frame resize/render ordering and static-mode redraw. |

## Prevention

- Treat canvas backing-store changes and the following draw as one paint-critical operation.
- Test callback ordering, not only eventual dimensions, for RAF-coordinated rendering code.

## Timeline

| Event      | Date       | Notes                                                                                        |
| ---------- | ---------- | -------------------------------------------------------------------------------------------- |
| Introduced | 2026-08-03 | Released in v0.12.1 by `f56f678`.                                                            |
| Reported   | 2026-08-03 | Observed during desktop resizing and mobile browser chrome changes.                          |
| Fixed      | 2026-08-03 | Resize work moved into the background render frame.                                          |
| Verified   | 2026-08-03 | Focused tests, full suite, formatting, production build, and browser viewport checks passed. |
