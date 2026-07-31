// @vitest-environment happy-dom

import type { BackgroundConfig, BackgroundEffect } from "../../src/backgrounds/types";
import { createWebGlBackgroundHost, normalizePointerPosition } from "../../src/backgrounds/webgl-background";

function createEffect(): BackgroundEffect<BackgroundConfig> {
  return {
    resize: vi.fn(),
    render: vi.fn(),
    update: vi.fn(),
    dispose: vi.fn(),
  };
}

describe("createWebGlBackgroundHost", () => {
  let animationFrameCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    animationFrameCallbacks = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => animationFrameCallbacks.push(callback)),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1000 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 500 });
  });

  afterEach(() => vi.unstubAllGlobals());

  test("reuses one context and loop while replacing only effect resources", () => {
    const gl = {
      COLOR_BUFFER_BIT: 0x4000,
      clear: vi.fn(),
      clearColor: vi.fn(),
      viewport: vi.fn(),
    } as unknown as WebGL2RenderingContext;
    const canvas = document.createElement("canvas");
    const getContext = vi.spyOn(canvas, "getContext").mockReturnValue(gl);
    const waves = createEffect();
    const tessellation = createEffect();
    const factory = vi.fn((_: WebGL2RenderingContext, config: BackgroundConfig) =>
      config.kind === "waves" ? waves : tessellation,
    );
    const initialConfig = { kind: "waves", seed: 1, speed: 1, intensity: 1 } as const;
    const host = createWebGlBackgroundHost(canvas, factory, initialConfig)!;

    host.update({ ...initialConfig, speed: 1.25 });
    expect(waves.update).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledTimes(1);

    host.update({ kind: "tessellation", seed: 2, speed: 1, intensity: 1 });
    expect(waves.dispose).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledTimes(2);
    expect(tessellation.resize).toHaveBeenCalledWith(1000, 500);
    expect(tessellation.render).toHaveBeenCalledWith({
      elapsedSeconds: 0,
      deltaSeconds: 0,
      pointer: { x: 0.5, y: 0.5 },
    });
    expect(getContext).toHaveBeenCalledTimes(1);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    host.dispose();
    expect(tessellation.dispose).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });

  test("normalizes pointer coordinates into bottom-left-origin UV space", () => {
    expect(normalizePointerPosition(250, 100, 1000, 500)).toEqual({ x: 0.25, y: 0.8 });
    expect(normalizePointerPosition(-20, 900, 1000, 500)).toEqual({ x: 0, y: 0 });
  });
});
