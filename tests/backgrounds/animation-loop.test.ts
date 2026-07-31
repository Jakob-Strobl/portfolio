// @vitest-environment happy-dom

import { createAnimationLoop, type FrameScheduler } from "../../src/backgrounds/animation-loop";

function createScheduler() {
  let nextHandle = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  const cancelled: number[] = [];
  const scheduler: FrameScheduler = {
    request(callback) {
      nextHandle += 1;
      callbacks.set(nextHandle, callback);
      return nextHandle;
    },
    cancel(handle) {
      callbacks.delete(handle);
      cancelled.push(handle);
    },
  };

  return { scheduler, callbacks, cancelled };
}

describe("createAnimationLoop", () => {
  test("uses one stable callback and does not start twice", () => {
    const runtime = createScheduler();
    const render = vi.fn();
    const loop = createAnimationLoop(render, runtime.scheduler);

    loop.start();
    loop.start();
    expect(runtime.callbacks.size).toBe(1);

    const firstCallback = runtime.callbacks.get(1)!;
    runtime.callbacks.delete(1);
    firstCallback(100);

    expect(render).toHaveBeenCalledWith(100);
    expect(runtime.callbacks.size).toBe(1);
    expect(runtime.callbacks.get(2)).toBe(firstCallback);
  });

  test("cancels the pending frame and remains stopped", () => {
    const runtime = createScheduler();
    const loop = createAnimationLoop(vi.fn(), runtime.scheduler);

    loop.start();
    loop.stop();

    expect(runtime.cancelled).toEqual([1]);
    expect(runtime.callbacks.size).toBe(0);
    expect(loop.isRunning()).toBe(false);
  });

  test("can be stopped safely during a render", () => {
    const runtime = createScheduler();
    let loop: ReturnType<typeof createAnimationLoop>;
    loop = createAnimationLoop(() => loop.stop(), runtime.scheduler);

    loop.start();
    const callback = runtime.callbacks.get(1)!;
    runtime.callbacks.delete(1);
    callback(100);

    expect(runtime.callbacks.size).toBe(0);
    expect(loop.isRunning()).toBe(false);
  });
});
