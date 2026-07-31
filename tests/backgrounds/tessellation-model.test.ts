import { createTessellationUniformValues } from "../../src/backgrounds/tessellation-model";

describe("createTessellationUniformValues", () => {
  test("maps a seed deterministically into two shader-safe values", () => {
    const config = { kind: "tessellation", seed: 0x1234abcd, speed: 1, intensity: 1 } as const;

    expect(createTessellationUniformValues(config)).toEqual(createTessellationUniformValues(config));
    expect(createTessellationUniformValues(config).seed).not.toEqual(
      createTessellationUniformValues({ ...config, seed: 0xabcd1234 }).seed,
    );
    expect(createTessellationUniformValues(config).seed.every((value) => value >= 0 && value <= 1)).toBe(true);
  });

  test("keeps runtime controls inside their curated ranges", () => {
    expect(
      createTessellationUniformValues({ kind: "tessellation", seed: 1, speed: -10, intensity: -10 }),
    ).toMatchObject({ speed: 0.25, intensity: 0.5 });
    expect(createTessellationUniformValues({ kind: "tessellation", seed: 1, speed: 10, intensity: 10 })).toMatchObject({
      speed: 1.75,
      intensity: 1.35,
    });
  });
});
