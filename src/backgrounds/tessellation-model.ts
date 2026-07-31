import type { TessellationBackgroundConfig } from "./types";
import { normalizeSeed } from "./wave-model";

export type TessellationUniformValues = {
  seed: readonly [number, number];
  speed: number;
  intensity: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function createTessellationUniformValues(config: TessellationBackgroundConfig): TessellationUniformValues {
  const seed = normalizeSeed(config.seed);

  return {
    seed: [(seed & 0xffff) / 0xffff, (seed >>> 16) / 0xffff],
    speed: clamp(config.speed, 0.25, 1.75),
    intensity: clamp(config.intensity, 0.5, 1.35),
  };
}
