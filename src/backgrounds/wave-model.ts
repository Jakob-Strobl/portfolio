import type { WavesBackgroundConfig } from "./types";

const GRAVITY = 9.81;
const TAU = Math.PI * 2;
const WAVE_COUNT = 4;
const MAX_TOTAL_AMPLITUDE = 0.72;
const MAX_TOTAL_STEEPNESS = 0.35;

export type WaveParameters = {
  direction: readonly [number, number];
  amplitude: number;
  wavelength: number;
  waveNumber: number;
  angularFrequency: number;
  steepness: number;
  phase: number;
};

function mulberry32(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function range(random: () => number, minimum: number, maximum: number) {
  return minimum + random() * (maximum - minimum);
}

export function normalizeSeed(seed: number): number {
  return Number.isFinite(seed) ? seed >>> 0 : 0;
}

export function createBackgroundSeed(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  }

  return Math.floor(Math.random() * 4294967296) >>> 0;
}

export function createWaveParameters(seed: number): WaveParameters[] {
  const random = mulberry32(normalizeSeed(seed));
  const windAngle = random() * TAU;
  const waves = Array.from({ length: WAVE_COUNT }, (_, index) => {
    const isDetailWave = index === WAVE_COUNT - 1;
    const angle = windAngle + range(random, -0.45, 0.45);
    const wavelength = isDetailWave ? range(random, 12, 17) : range(random, 22, 38);
    const waveNumber = TAU / wavelength;

    return {
      direction: [Math.cos(angle), Math.sin(angle)] as const,
      amplitude: isDetailWave ? range(random, 0.06, 0.1) : range(random, 0.13, 0.22),
      wavelength,
      waveNumber,
      angularFrequency: Math.sqrt(GRAVITY * waveNumber),
      steepness: range(random, 0.08, 0.18),
      phase: random() * TAU,
    };
  });

  const totalAmplitude = waves.reduce((sum, wave) => sum + wave.amplitude, 0);
  const amplitudeScale = Math.min(1, MAX_TOTAL_AMPLITUDE / totalAmplitude);

  for (const wave of waves) {
    wave.amplitude *= amplitudeScale;
  }

  const totalSteepness = waves.reduce((sum, wave) => sum + wave.steepness * wave.waveNumber * wave.amplitude, 0);
  const steepnessScale = Math.min(1, MAX_TOTAL_STEEPNESS / totalSteepness);

  for (const wave of waves) {
    wave.steepness *= steepnessScale;
  }

  return waves;
}

export function createDefaultWavesConfig(seed = createBackgroundSeed()): WavesBackgroundConfig {
  return {
    kind: "waves",
    seed: normalizeSeed(seed),
    speed: 1,
    intensity: 1,
  };
}
