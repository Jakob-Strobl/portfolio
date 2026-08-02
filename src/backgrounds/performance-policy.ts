import type { BackgroundFrameRatePreference, BackgroundQuality, BackgroundRuntimePreferences } from "./types";

export type BackgroundFrameMode = "static" | "30" | "display";

export type BackgroundPerformanceHints = {
  reducedMotion: boolean;
  coarsePointer: boolean;
  batteryCharging?: boolean;
};

export type BatteryManagerHint = EventTarget & {
  readonly charging: boolean;
};

type NavigatorWithBatteryHint = Navigator & {
  getBattery?: () => Promise<BatteryManagerHint>;
};

export type BackgroundPerformanceObserverEnvironment = {
  matchMedia(query: string): MediaQueryList;
  isSecureContext: boolean;
  navigator: NavigatorWithBatteryHint;
};

export type BackgroundPerformanceObserver = {
  snapshot(): BackgroundPerformanceHints;
  dispose(): void;
};

const LOW_QUALITY_RESOLUTION_SCALE = 0.75;
const MAX_AUTO_DEVICE_PIXEL_RATIO = 2;
const MAX_COARSE_POINTER_RESOLUTION_SCALE = 1.5;

export const DEFAULT_BACKGROUND_PREFERENCES: BackgroundRuntimePreferences = {
  quality: "auto",
  frameRate: "auto",
};

export function resolveBackgroundFrameMode(
  preference: BackgroundFrameRatePreference,
  hints: BackgroundPerformanceHints,
): BackgroundFrameMode {
  if (hints.reducedMotion) return "static";
  if (preference === "30") return "30";
  if (preference === "display") return "display";
  if (hints.batteryCharging != null) return hints.batteryCharging ? "display" : "30";
  return hints.coarsePointer ? "30" : "display";
}

export function resolveBackgroundResolutionScale(
  quality: BackgroundQuality,
  coarsePointer: boolean,
  devicePixelRatio = 1,
) {
  if (quality === "low") return LOW_QUALITY_RESOLUTION_SCALE;

  const normalizedDevicePixelRatio = Number.isFinite(devicePixelRatio)
    ? Math.min(MAX_AUTO_DEVICE_PIXEL_RATIO, Math.max(1, devicePixelRatio))
    : 1;
  if (!coarsePointer) return normalizedDevicePixelRatio;

  // Touch devices keep the existing 0.75x economy path at 1x, but gain a
  // sharper backing store on Retina displays without paying for their full
  // 2–3x native pixel density. Auto also caps mobile at 1.5x because fill
  // cost grows with the square of this value.
  return Math.min(MAX_COARSE_POINTER_RESOLUTION_SCALE, normalizedDevicePixelRatio * LOW_QUALITY_RESOLUTION_SCALE);
}

function observeMediaQuery(query: MediaQueryList, listener: () => void) {
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export function observeBackgroundPerformanceHints(
  onChange: () => void,
  environment: BackgroundPerformanceObserverEnvironment = {
    matchMedia: (query) => window.matchMedia(query),
    isSecureContext: window.isSecureContext,
    navigator: navigator as NavigatorWithBatteryHint,
  },
): BackgroundPerformanceObserver {
  const reducedMotionQuery = environment.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = environment.matchMedia("(pointer: coarse)");
  let battery: BatteryManagerHint | undefined;
  let batteryCharging: boolean | undefined;
  let disposed = false;

  const handleMediaChange = () => onChange();
  const stopObservingReducedMotion = observeMediaQuery(reducedMotionQuery, handleMediaChange);
  const stopObservingCoarsePointer = observeMediaQuery(coarsePointerQuery, handleMediaChange);
  const handleChargingChange = () => {
    batteryCharging = battery?.charging;
    onChange();
  };

  if (environment.isSecureContext && typeof environment.navigator.getBattery === "function") {
    void environment.navigator
      .getBattery()
      .then((nextBattery) => {
        if (disposed) return;
        battery = nextBattery;
        batteryCharging = nextBattery.charging;
        battery.addEventListener("chargingchange", handleChargingChange);
        onChange();
      })
      .catch(() => {
        // Battery status is an optional optimization hint. Media-query fallbacks remain valid when it is unavailable.
      });
  }

  return {
    snapshot() {
      return {
        reducedMotion: reducedMotionQuery.matches,
        coarsePointer: coarsePointerQuery.matches,
        batteryCharging,
      };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stopObservingReducedMotion();
      stopObservingCoarsePointer();
      battery?.removeEventListener("chargingchange", handleChargingChange);
      battery = undefined;
    },
  };
}
