import { createContext, createMemo, createSignal, onMount, useContext } from "solid-js";
import type { Accessor, JSX } from "solid-js";

import { createBackgroundSeed, normalizeSeed } from "~/backgrounds/wave-model";
import type {
  BackgroundConfig,
  BackgroundFrameRatePreference,
  BackgroundKind,
  BackgroundQuality,
} from "~/backgrounds/types";

export type BackgroundEffectPreference = "random" | BackgroundKind;

const MIN_SPEED = 0.25;
const MAX_SPEED = 1.75;
const MIN_INTENSITY = 0.5;
const MAX_INTENSITY = 1.35;
export const BACKGROUND_PREFERENCES_STORAGE_KEY = "portfolio.background-preferences";

export const BACKGROUND_CONTROL_RANGES = {
  speed: { minimum: MIN_SPEED, maximum: MAX_SPEED, step: 0.05 },
  intensity: { minimum: MIN_INTENSITY, maximum: MAX_INTENSITY, step: 0.05 },
} as const;

type BackgroundContextValue = {
  config: Accessor<BackgroundConfig>;
  kind: Accessor<BackgroundKind>;
  seed: Accessor<number>;
  effectPreference: Accessor<BackgroundEffectPreference>;
  speed: Accessor<number>;
  intensity: Accessor<number>;
  quality: Accessor<BackgroundQuality>;
  frameRate: Accessor<BackgroundFrameRatePreference>;
  setKind(kind: BackgroundKind): void;
  setEffectPreference(preference: BackgroundEffectPreference): void;
  setSpeed(speed: number): void;
  setIntensity(intensity: number): void;
  setQuality(quality: BackgroundQuality): void;
  setFrameRate(frameRate: BackgroundFrameRatePreference): void;
  savePreferences(): boolean;
  regenerateSeed(): void;
};

const BackgroundContext = createContext<BackgroundContextValue>();

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function isBackgroundKind(value: unknown): value is BackgroundKind {
  return value === "waves" || value === "tessellation";
}

function isEffectPreference(value: unknown): value is BackgroundEffectPreference {
  return value === "random" || isBackgroundKind(value);
}

function isBackgroundQuality(value: unknown): value is BackgroundQuality {
  return value === "auto" || value === "low";
}

function isBackgroundFrameRatePreference(value: unknown): value is BackgroundFrameRatePreference {
  return value === "auto" || value === "30" || value === "display";
}

function chooseRandomBackgroundKind(): BackgroundKind {
  return Math.random() < 0.5 ? "waves" : "tessellation";
}

function readSavedPreferences(): {
  effect: BackgroundEffectPreference;
  speed: number;
  intensity: number;
  quality: BackgroundQuality;
  frameRate: BackgroundFrameRatePreference;
} | null {
  try {
    const rawPreferences = window.localStorage.getItem(BACKGROUND_PREFERENCES_STORAGE_KEY);
    if (rawPreferences == null) return null;

    const parsed = JSON.parse(rawPreferences) as Record<string, unknown>;
    return {
      effect: isEffectPreference(parsed.effect) ? parsed.effect : "random",
      speed: typeof parsed.speed === "number" ? clamp(parsed.speed, MIN_SPEED, MAX_SPEED) : 1,
      intensity: typeof parsed.intensity === "number" ? clamp(parsed.intensity, MIN_INTENSITY, MAX_INTENSITY) : 1,
      quality: isBackgroundQuality(parsed.quality) ? parsed.quality : "auto",
      frameRate: isBackgroundFrameRatePreference(parsed.frameRate) ? parsed.frameRate : "auto",
    };
  } catch (error) {
    console.error("Background: Could not read saved preferences", error);
    return null;
  }
}

export function BackgroundProvider(props: { children: JSX.Element }) {
  const [kind, setKind] = createSignal<BackgroundKind>("waves");
  const [seed, setSeed] = createSignal(createBackgroundSeed());
  const [effectPreference, setEffectPreferenceValue] = createSignal<BackgroundEffectPreference>("random");
  const [speed, setSpeedValue] = createSignal(1);
  const [intensity, setIntensityValue] = createSignal(1);
  const [quality, setQuality] = createSignal<BackgroundQuality>("auto");
  const [frameRate, setFrameRate] = createSignal<BackgroundFrameRatePreference>("auto");

  onMount(() => {
    const savedPreferences = readSavedPreferences();

    if (savedPreferences == null) {
      setKind(chooseRandomBackgroundKind());
      return;
    }

    setEffectPreferenceValue(savedPreferences.effect);
    setKind(savedPreferences.effect === "random" ? chooseRandomBackgroundKind() : savedPreferences.effect);
    setSpeedValue(savedPreferences.speed);
    setIntensityValue(savedPreferences.intensity);
    setQuality(savedPreferences.quality);
    setFrameRate(savedPreferences.frameRate);
  });

  const config = createMemo<BackgroundConfig>(() => ({
    kind: kind(),
    seed: seed(),
    speed: speed(),
    intensity: intensity(),
  }));

  const value: BackgroundContextValue = {
    config,
    kind,
    seed,
    effectPreference,
    speed,
    intensity,
    quality,
    frameRate,
    setKind(nextKind) {
      setKind(nextKind);
      setEffectPreferenceValue(nextKind);
    },
    setEffectPreference(preference) {
      setEffectPreferenceValue(preference);
      setKind(preference === "random" ? chooseRandomBackgroundKind() : preference);
    },
    setSpeed(nextSpeed) {
      setSpeedValue(clamp(nextSpeed, MIN_SPEED, MAX_SPEED));
    },
    setIntensity(nextIntensity) {
      setIntensityValue(clamp(nextIntensity, MIN_INTENSITY, MAX_INTENSITY));
    },
    setQuality,
    setFrameRate,
    savePreferences() {
      try {
        window.localStorage.setItem(
          BACKGROUND_PREFERENCES_STORAGE_KEY,
          JSON.stringify({
            effect: effectPreference(),
            speed: speed(),
            intensity: intensity(),
            quality: quality(),
            frameRate: frameRate(),
          }),
        );
        return true;
      } catch (error) {
        console.error("Background: Could not save preferences", error);
        return false;
      }
    },
    regenerateSeed() {
      setSeed((currentSeed) => {
        const nextSeed = normalizeSeed(createBackgroundSeed());
        return nextSeed === currentSeed ? normalizeSeed(currentSeed + 1) : nextSeed;
      });
    },
  };

  return <BackgroundContext.Provider value={value}>{props.children}</BackgroundContext.Provider>;
}

export function useBackground() {
  const context = useContext(BackgroundContext);

  if (context == null) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }

  return context;
}
