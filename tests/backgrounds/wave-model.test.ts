// @vitest-environment happy-dom

import { createWaveHueOffset, createWaveParameters } from "../../src/backgrounds/wave-model";

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

describe("createWaveHueOffset", () => {
  test("is deterministic, normalized, and independent across seeds", () => {
    const offset = createWaveHueOffset(123456);

    expect(offset).toBe(createWaveHueOffset(123456));
    expect(offset).toBeGreaterThanOrEqual(0);
    expect(offset).toBeLessThan(1);
    expect(createWaveHueOffset(-1)).toBe(createWaveHueOffset(0xffffffff));
    expect(offset).not.toBe(createWaveHueOffset(654321));
  });

  test("distributes starting hues across the full rainbow", () => {
    const offsets = Array.from({ length: 128 }, (_, seed) => createWaveHueOffset(seed));
    const occupiedOctants = new Set(offsets.map((offset) => Math.floor(offset * 8)));

    expect(new Set(offsets).size).toBe(offsets.length);
    expect(occupiedOctants.size).toBe(8);
    expect(Math.min(...offsets)).toBeLessThan(0.05);
    expect(Math.max(...offsets)).toBeGreaterThan(0.95);
  });
});
