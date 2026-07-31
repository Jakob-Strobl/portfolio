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

class MutableMediaQuery extends EventTarget {
  constructor(public matches: boolean) {
    super();
  }

  setMatches(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event("change"));
  }
}

class MutableBattery extends EventTarget {
  constructor(public charging: boolean) {
    super();
  }

  setCharging(charging: boolean) {
    this.charging = charging;
    this.dispatchEvent(new Event("chargingchange"));
  }
}

function createGl() {
  return {
    COLOR_BUFFER_BIT: 0x4000,
    clear: vi.fn(),
    clearColor: vi.fn(),
    viewport: vi.fn(),
  } as unknown as WebGL2RenderingContext;
}

describe("createWebGlBackgroundHost", () => {
  let animationFrameCallbacks: Map<number, FrameRequestCallback>;
  let nextAnimationFrameHandle: number;
  let documentHidden: boolean;
  let reducedMotion: MutableMediaQuery;
  let coarsePointer: MutableMediaQuery;

  function runNextFrame(timestamp: number) {
    const [handle, callback] = animationFrameCallbacks.entries().next().value!;
    animationFrameCallbacks.delete(handle);
    callback(timestamp);
  }

  beforeEach(() => {
    animationFrameCallbacks = new Map();
    nextAnimationFrameHandle = 0;
    documentHidden = false;
    reducedMotion = new MutableMediaQuery(false);
    coarsePointer = new MutableMediaQuery(false);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        nextAnimationFrameHandle += 1;
        animationFrameCallbacks.set(nextAnimationFrameHandle, callback);
        return nextAnimationFrameHandle;
      }),
    );
    vi.stubGlobal(
      "cancelAnimationFrame",
      vi.fn((handle: number) => animationFrameCallbacks.delete(handle)),
    );
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) => (query.includes("reduced-motion") ? reducedMotion : coarsePointer) as unknown as MediaQueryList,
    );
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1000 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 500 });
    Object.defineProperty(document, "hidden", { configurable: true, get: () => documentHidden });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("reuses one context and loop while replacing only effect resources", () => {
    const gl = createGl();
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
    runNextFrame(100);
    expect(tessellation.render).toHaveBeenCalledWith({
      elapsedSeconds: 0,
      deltaSeconds: 0,
      pointer: { x: 0.5, y: 0.5 },
    });
    expect(getContext).toHaveBeenCalledTimes(1);
    expect(getContext).toHaveBeenCalledWith(
      "webgl2",
      expect.objectContaining({ powerPreference: "default", antialias: false, depth: false }),
    );
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);

    host.dispose();
    expect(tessellation.dispose).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });

  test("normalizes pointer coordinates into bottom-left-origin UV space", () => {
    expect(normalizePointerPosition(250, 100, 1000, 500)).toEqual({ x: 0.25, y: 0.8 });
    expect(normalizePointerPosition(-20, 900, 1000, 500)).toEqual({ x: 0, y: 0 });
  });

  test("keeps the CSS viewport stable while lowering Low quality render resolution", () => {
    const gl = createGl();
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(gl);
    const effect = createEffect();
    const config = { kind: "waves", seed: 1, speed: 1, intensity: 1 } as const;
    const host = createWebGlBackgroundHost(canvas, () => effect, config, { quality: "low", frameRate: "display" })!;

    expect(canvas.width).toBe(750);
    expect(canvas.height).toBe(375);
    expect(effect.resize).toHaveBeenCalledWith(750, 375);
    expect(gl.viewport).toHaveBeenLastCalledWith(0, 0, 750, 375);

    host.update(config, { quality: "auto", frameRate: "display" });
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(500);
    expect(effect.resize).toHaveBeenLastCalledWith(1000, 500);

    coarsePointer.setMatches(true);
    expect(canvas.width).toBe(750);
    expect(canvas.height).toBe(375);
    host.dispose();
  });

  test("renders reduced-motion mode once and again only after an update", () => {
    reducedMotion.setMatches(true);
    const gl = createGl();
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(gl);
    const effect = createEffect();
    const config = { kind: "waves", seed: 1, speed: 1, intensity: 1 } as const;
    const host = createWebGlBackgroundHost(canvas, () => effect, config)!;

    expect(animationFrameCallbacks.size).toBe(1);
    runNextFrame(0);
    expect(effect.render).toHaveBeenCalledTimes(1);
    expect(animationFrameCallbacks.size).toBe(0);

    host.update({ ...config, seed: 2 });
    expect(animationFrameCallbacks.size).toBe(1);
    runNextFrame(5000);
    expect(effect.render).toHaveBeenCalledTimes(2);
    expect(effect.render).toHaveBeenLastCalledWith({
      elapsedSeconds: 0,
      deltaSeconds: 0,
      pointer: { x: 0.5, y: 0.5 },
    });
    expect(animationFrameCallbacks.size).toBe(0);
    host.dispose();
  });

  test("stops while hidden and resumes without counting hidden time", () => {
    const gl = createGl();
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(gl);
    const effect = createEffect();
    const config = { kind: "waves", seed: 1, speed: 1, intensity: 1 } as const;
    const host = createWebGlBackgroundHost(canvas, () => effect, config, { quality: "auto", frameRate: "display" })!;

    runNextFrame(100);
    runNextFrame(116);
    expect(effect.render).toHaveBeenCalledTimes(2);

    documentHidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(animationFrameCallbacks.size).toBe(0);
    host.update({ ...config, intensity: 0.75 });
    expect(animationFrameCallbacks.size).toBe(0);

    documentHidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    expect(animationFrameCallbacks.size).toBe(1);
    runNextFrame(10_000);
    expect(effect.render).toHaveBeenLastCalledWith({
      elapsedSeconds: 0.016,
      deltaSeconds: 0,
      pointer: { x: 0.5, y: 0.5 },
    });
    host.dispose();
  });

  test("changes Auto live between battery-capped and charging display-rate rendering", async () => {
    const secureContextDescriptor = Object.getOwnPropertyDescriptor(window, "isSecureContext");
    const getBatteryDescriptor = Object.getOwnPropertyDescriptor(navigator, "getBattery");
    const battery = new MutableBattery(false);
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "getBattery", { configurable: true, value: async () => battery });

    try {
      const gl = createGl();
      const canvas = document.createElement("canvas");
      vi.spyOn(canvas, "getContext").mockReturnValue(gl);
      const effect = createEffect();
      const config = { kind: "waves", seed: 1, speed: 1, intensity: 1 } as const;
      const host = createWebGlBackgroundHost(canvas, () => effect, config)!;

      await Promise.resolve();
      runNextFrame(0);
      runNextFrame(16.7);
      runNextFrame(33.4);
      expect(effect.render).toHaveBeenCalledTimes(2);

      battery.setCharging(true);
      runNextFrame(40);
      runNextFrame(48.3);
      expect(effect.render).toHaveBeenCalledTimes(4);
      host.dispose();
    } finally {
      if (secureContextDescriptor == null) Reflect.deleteProperty(window, "isSecureContext");
      else Object.defineProperty(window, "isSecureContext", secureContextDescriptor);
      if (getBatteryDescriptor == null) Reflect.deleteProperty(navigator, "getBattery");
      else Object.defineProperty(navigator, "getBattery", getBatteryDescriptor);
    }
  });
});
