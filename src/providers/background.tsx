import { createContext, createMemo, createSignal, useContext } from "solid-js";
import type { Accessor, JSX } from "solid-js";

import { createBackgroundSeed, normalizeSeed } from "~/backgrounds/wave-model";
import type {
  BackgroundConfig,
  BackgroundFrameRatePreference,
  BackgroundKind,
  BackgroundQuality,
} from "~/backgrounds/types";

const MIN_SPEED = 0.25;
const MAX_SPEED = 1.75;
const MIN_INTENSITY = 0.5;
const MAX_INTENSITY = 1.35;

export const BACKGROUND_CONTROL_RANGES = {
  speed: { minimum: MIN_SPEED, maximum: MAX_SPEED, step: 0.05 },
  intensity: { minimum: MIN_INTENSITY, maximum: MAX_INTENSITY, step: 0.05 },
} as const;

type BackgroundContextValue = {
  config: Accessor<BackgroundConfig>;
  kind: Accessor<BackgroundKind>;
  seed: Accessor<number>;
  speed: Accessor<number>;
  intensity: Accessor<number>;
  quality: Accessor<BackgroundQuality>;
  frameRate: Accessor<BackgroundFrameRatePreference>;
  setKind(kind: BackgroundKind): void;
  setSpeed(speed: number): void;
  setIntensity(intensity: number): void;
  setQuality(quality: BackgroundQuality): void;
  setFrameRate(frameRate: BackgroundFrameRatePreference): void;
  regenerateSeed(): void;
};

const BackgroundContext = createContext<BackgroundContextValue>();

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function BackgroundProvider(props: { children: JSX.Element }) {
  const [kind, setKind] = createSignal<BackgroundKind>("waves");
  const [seed, setSeed] = createSignal(createBackgroundSeed());
  const [speed, setSpeedValue] = createSignal(1);
  const [intensity, setIntensityValue] = createSignal(1);
  const [quality, setQuality] = createSignal<BackgroundQuality>("auto");
  const [frameRate, setFrameRate] = createSignal<BackgroundFrameRatePreference>("auto");
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
    speed,
    intensity,
    quality,
    frameRate,
    setKind,
    setSpeed(nextSpeed) {
      setSpeedValue(clamp(nextSpeed, MIN_SPEED, MAX_SPEED));
    },
    setIntensity(nextIntensity) {
      setIntensityValue(clamp(nextIntensity, MIN_INTENSITY, MAX_INTENSITY));
    },
    setQuality,
    setFrameRate,
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
