// @vitest-environment happy-dom

import {
  observeBackgroundPerformanceHints,
  resolveBackgroundFrameMode,
  resolveBackgroundResolutionScale,
  type BatteryManagerHint,
  type BackgroundPerformanceObserverEnvironment,
} from "../../src/backgrounds/performance-policy";

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

function createEnvironment(options: {
  reducedMotion?: boolean;
  coarsePointer?: boolean;
  isSecureContext?: boolean;
  getBattery?: () => Promise<BatteryManagerHint>;
}) {
  const reducedMotion = new MutableMediaQuery(options.reducedMotion ?? false);
  const coarsePointer = new MutableMediaQuery(options.coarsePointer ?? false);
  const environment: BackgroundPerformanceObserverEnvironment = {
    matchMedia(query) {
      return (query.includes("reduced-motion") ? reducedMotion : coarsePointer) as unknown as MediaQueryList;
    },
    isSecureContext: options.isSecureContext ?? true,
    navigator: { getBattery: options.getBattery } as Navigator & {
      getBattery?: () => Promise<BatteryManagerHint>;
    },
  };

  return { environment, reducedMotion, coarsePointer };
}

describe("background performance policy", () => {
  test("honors reduced motion before explicit and automatic frame-rate preferences", () => {
    expect(resolveBackgroundFrameMode("display", { reducedMotion: true, coarsePointer: false })).toBe("static");
    expect(
      resolveBackgroundFrameMode("30", { reducedMotion: false, coarsePointer: false, batteryCharging: true }),
    ).toBe("30");
    expect(
      resolveBackgroundFrameMode("display", {
        reducedMotion: false,
        coarsePointer: true,
        batteryCharging: false,
      }),
    ).toBe("display");
  });

  test("uses charging status for Auto and falls back to pointer type when battery status is absent", () => {
    expect(
      resolveBackgroundFrameMode("auto", { reducedMotion: false, coarsePointer: true, batteryCharging: true }),
    ).toBe("display");
    expect(
      resolveBackgroundFrameMode("auto", { reducedMotion: false, coarsePointer: false, batteryCharging: false }),
    ).toBe("30");
    expect(resolveBackgroundFrameMode("auto", { reducedMotion: false, coarsePointer: false })).toBe("display");
    expect(resolveBackgroundFrameMode("auto", { reducedMotion: false, coarsePointer: true })).toBe("30");
  });

  test("uses capped HiDPI resolution while keeping coarse-pointer and Low paths economical", () => {
    expect(resolveBackgroundResolutionScale("auto", false)).toBe(1);
    expect(resolveBackgroundResolutionScale("auto", true)).toBe(0.75);
    expect(resolveBackgroundResolutionScale("low", false)).toBe(0.75);
    expect(resolveBackgroundResolutionScale("auto", false, 2)).toBe(2);
    expect(resolveBackgroundResolutionScale("auto", false, 3)).toBe(2);
    expect(resolveBackgroundResolutionScale("auto", true, 2)).toBe(1.5);
    expect(resolveBackgroundResolutionScale("auto", true, 3)).toBe(1.5);
    expect(resolveBackgroundResolutionScale("low", false, 2)).toBe(0.75);
  });

  test("observes live charging and media-query changes, then removes all listeners", async () => {
    const battery = new MutableBattery(false);
    const runtime = createEnvironment({ getBattery: async () => battery });
    const onChange = vi.fn();
    const observer = observeBackgroundPerformanceHints(onChange, runtime.environment);

    await Promise.resolve();
    expect(observer.snapshot()).toEqual({ reducedMotion: false, coarsePointer: false, batteryCharging: false });

    battery.setCharging(true);
    runtime.reducedMotion.setMatches(true);
    runtime.coarsePointer.setMatches(true);
    expect(observer.snapshot()).toEqual({ reducedMotion: true, coarsePointer: true, batteryCharging: true });
    expect(onChange).toHaveBeenCalledTimes(4);

    observer.dispose();
    battery.setCharging(false);
    runtime.reducedMotion.setMatches(false);
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  test("falls back cleanly when battery access fails and ignores an async result after disposal", async () => {
    const failedRuntime = createEnvironment({
      coarsePointer: true,
      getBattery: async () => Promise.reject(new Error("not available")),
    });
    const failedObserver = observeBackgroundPerformanceHints(vi.fn(), failedRuntime.environment);
    await Promise.resolve();
    await Promise.resolve();
    expect(failedObserver.snapshot().batteryCharging).toBeUndefined();
    expect(resolveBackgroundFrameMode("auto", failedObserver.snapshot())).toBe("30");
    failedObserver.dispose();

    let resolveBattery!: (battery: BatteryManagerHint) => void;
    const delayedBattery = new Promise<BatteryManagerHint>((resolve) => {
      resolveBattery = resolve;
    });
    const delayedRuntime = createEnvironment({ getBattery: () => delayedBattery });
    const onChange = vi.fn();
    const delayedObserver = observeBackgroundPerformanceHints(onChange, delayedRuntime.environment);
    delayedObserver.dispose();
    const battery = new MutableBattery(true);
    resolveBattery(battery);
    await Promise.resolve();
    battery.setCharging(false);

    expect(onChange).not.toHaveBeenCalled();
  });
});
