import type { BackgroundFrameMode } from "./performance-policy";

export type FrameScheduler = {
  request(callback: FrameRequestCallback): number;
  cancel(handle: number): void;
};

export type AnimationLoop = {
  start(): void;
  stop(): void;
  invalidate(): void;
  setMode(mode: BackgroundFrameMode): void;
  isRunning(): boolean;
};

const THIRTY_FPS_INTERVAL_MS = 1000 / 30;
const FRAME_INTERVAL_TOLERANCE_MS = 1;

export function createAnimationLoop(
  render: FrameRequestCallback,
  scheduler: FrameScheduler = {
    request: (callback) => requestAnimationFrame(callback),
    cancel: (handle) => cancelAnimationFrame(handle),
  },
): AnimationLoop {
  let frameHandle: number | undefined;
  let running = false;
  let mode: BackgroundFrameMode = "display";
  let forceNextFrame = false;
  let lastRenderedTimestamp: number | undefined;

  function schedule() {
    if (!running || frameHandle != null) return;
    frameHandle = scheduler.request(frame);
  }

  const frame: FrameRequestCallback = (timestamp) => {
    frameHandle = undefined;
    if (!running) return;

    const intervalElapsed =
      lastRenderedTimestamp == null ||
      timestamp - lastRenderedTimestamp >= THIRTY_FPS_INTERVAL_MS - FRAME_INTERVAL_TOLERANCE_MS;
    const shouldRender = forceNextFrame || mode !== "30" || intervalElapsed;

    if (shouldRender) {
      forceNextFrame = false;
      lastRenderedTimestamp = timestamp;
      render(timestamp);
    }

    if (mode !== "static") schedule();
  };

  return {
    start() {
      if (running) return;
      running = true;
      forceNextFrame = true;
      schedule();
    },
    stop() {
      running = false;
      if (frameHandle == null) return;
      scheduler.cancel(frameHandle);
      frameHandle = undefined;
    },
    invalidate() {
      if (!running) return;
      if (mode === "static") forceNextFrame = true;
      schedule();
    },
    setMode(nextMode) {
      if (mode === nextMode) return;
      mode = nextMode;
      lastRenderedTimestamp = undefined;
      forceNextFrame = true;

      if (!running) return;
      if (frameHandle != null) {
        scheduler.cancel(frameHandle);
        frameHandle = undefined;
      }
      schedule();
    },
    isRunning() {
      return running;
    },
  };
}
