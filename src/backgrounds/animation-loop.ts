export type FrameScheduler = {
  request(callback: FrameRequestCallback): number;
  cancel(handle: number): void;
};

export type AnimationLoop = {
  start(): void;
  stop(): void;
  isRunning(): boolean;
};

export function createAnimationLoop(
  render: FrameRequestCallback,
  scheduler: FrameScheduler = {
    request: (callback) => requestAnimationFrame(callback),
    cancel: (handle) => cancelAnimationFrame(handle),
  },
): AnimationLoop {
  let frameHandle: number | undefined;
  let running = false;

  const frame: FrameRequestCallback = (timestamp) => {
    frameHandle = undefined;
    if (!running) return;

    render(timestamp);
    if (running) frameHandle = scheduler.request(frame);
  };

  return {
    start() {
      if (running) return;
      running = true;
      frameHandle = scheduler.request(frame);
    },
    stop() {
      running = false;
      if (frameHandle == null) return;
      scheduler.cancel(frameHandle);
      frameHandle = undefined;
    },
    isRunning() {
      return running;
    },
  };
}
