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

function runNextFrame(runtime: ReturnType<typeof createScheduler>, timestamp: number) {
  const [handle, callback] = runtime.callbacks.entries().next().value!;
  runtime.callbacks.delete(handle);
  callback(timestamp);
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

  test("caps rendering near 30 FPS while keeping the scheduler alive", () => {
    const runtime = createScheduler();
    const render = vi.fn();
    const loop = createAnimationLoop(render, runtime.scheduler);
    loop.setMode("30");
    loop.start();

    runNextFrame(runtime, 0);
    loop.invalidate();
    runNextFrame(runtime, 16.7);
    runNextFrame(runtime, 33.4);
    runNextFrame(runtime, 50.1);
    runNextFrame(runtime, 66.8);

    expect(render.mock.calls.map(([timestamp]) => timestamp)).toEqual([0, 33.4, 66.8]);
    expect(runtime.callbacks.size).toBe(1);
  });

  test("renders every display frame when uncapped", () => {
    const runtime = createScheduler();
    const render = vi.fn();
    const loop = createAnimationLoop(render, runtime.scheduler);
    loop.setMode("display");
    loop.start();

    runNextFrame(runtime, 0);
    runNextFrame(runtime, 8.3);
    runNextFrame(runtime, 16.7);

    expect(render.mock.calls.map(([timestamp]) => timestamp)).toEqual([0, 8.3, 16.7]);
  });

  test("renders static mode only when explicitly invalidated", () => {
    const runtime = createScheduler();
    const render = vi.fn();
    const loop = createAnimationLoop(render, runtime.scheduler);
    loop.setMode("static");
    loop.start();

    runNextFrame(runtime, 0);
    expect(render).toHaveBeenCalledTimes(1);
    expect(runtime.callbacks.size).toBe(0);

    loop.invalidate();
    expect(runtime.callbacks.size).toBe(1);
    runNextFrame(runtime, 5000);

    expect(render).toHaveBeenCalledTimes(2);
    expect(runtime.callbacks.size).toBe(0);
  });
});
