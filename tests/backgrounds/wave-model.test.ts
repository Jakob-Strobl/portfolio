// @vitest-environment happy-dom

import { createWaveParameters } from "../../src/backgrounds/wave-model";

describe("createWaveParameters", () => {
  test("is deterministic for a seed", () => {
    expect(createWaveParameters(123456)).toEqual(createWaveParameters(123456));
    expect(createWaveParameters(123456)).not.toEqual(createWaveParameters(654321));
  });

  test("creates independent normalized directions", () => {
    const waves = createWaveParameters(42);

    for (const wave of waves) {
      expect(Math.hypot(...wave.direction)).toBeCloseTo(1);
    }

    expect(new Set(waves.map((wave) => wave.direction)).size).toBe(waves.length);
    expect(new Set(waves.map((wave) => wave.direction.join(","))).size).toBe(waves.length);
  });

  test("uses consistent deep-water wave math", () => {
    const waves = createWaveParameters(2026);

    for (const wave of waves) {
      expect(wave.waveNumber).toBeCloseTo((Math.PI * 2) / wave.wavelength);
      expect(wave.angularFrequency).toBeCloseTo(Math.sqrt(9.81 * wave.waveNumber));
    }
  });

  test("keeps generated waves broad and below safe amplitude and steepness bounds", () => {
    for (let seed = 0; seed < 100; seed += 1) {
      const waves = createWaveParameters(seed);
      const totalAmplitude = waves.reduce((sum, wave) => sum + wave.amplitude, 0);
      const totalSteepness = waves.reduce((sum, wave) => sum + wave.steepness * wave.waveNumber * wave.amplitude, 0);

      expect(waves).toHaveLength(4);
      expect(Math.max(...waves.slice(0, 3).map((wave) => wave.wavelength))).toBeLessThanOrEqual(38);
      expect(Math.min(...waves.slice(0, 3).map((wave) => wave.wavelength))).toBeGreaterThanOrEqual(22);
      expect(waves[3].wavelength).toBeGreaterThanOrEqual(12);
      expect(waves[3].wavelength).toBeLessThanOrEqual(17);
      expect(totalAmplitude).toBeLessThanOrEqual(0.72 + Number.EPSILON);
      expect(totalSteepness).toBeLessThanOrEqual(0.35 + Number.EPSILON);
    }
  });
});
