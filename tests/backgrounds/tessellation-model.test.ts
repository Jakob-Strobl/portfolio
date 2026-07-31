import {
  advanceTessellationModel,
  canStartTessellationTransition,
  consumeTopologyTime,
  createTessellationEdges,
  createTessellationModel,
  createTessellationTransitionEdges,
  createTessellationValues,
  getAnchorGlow,
  getAnchorHue,
  getAnchorLife,
  getLifecyclePulseInfluence,
  getTessellationTransitionWeights,
  isTessellationTransitionComplete,
  TESSELLATION_MAX_INTERIOR_ANCHORS,
  TESSELLATION_MAX_LIFECYCLE_PULSES,
  TESSELLATION_MIN_INTERIOR_ANCHORS,
  TESSELLATION_TOPOLOGY_INTERVAL_SECONDS,
  TESSELLATION_TRANSITION_SECONDS,
  shouldResetTessellationAspect,
  triangulateTessellation,
} from "../../src/backgrounds/tessellation-model";

function snapshotModel(model: ReturnType<typeof createTessellationModel>) {
  return model.anchors.map(({ id, x, y, hue, brightness, boundary, state }) => ({
    id,
    x,
    y,
    hue,
    brightness,
    boundary,
    state,
  }));
}

describe("living tessellation model", () => {
  test("creates the same well-spaced population for the same seed", () => {
    const first = createTessellationModel(0x1234abcd, 16 / 9);
    const second = createTessellationModel(0x1234abcd, 16 / 9);
    const different = createTessellationModel(0xabcd1234, 16 / 9);
    const interior = first.anchors.filter((anchor) => !anchor.boundary);

    expect(snapshotModel(first)).toEqual(snapshotModel(second));
    expect(snapshotModel(first)).not.toEqual(snapshotModel(different));
    expect(interior.length).toBeGreaterThanOrEqual(36);
    expect(interior.length).toBeLessThanOrEqual(42);
    expect(first.anchors.some((anchor) => anchor.boundary && anchor.x < 0)).toBe(true);
    expect(first.anchors.some((anchor) => anchor.boundary && anchor.x > 1)).toBe(true);
  });

  test("produces deterministic, nondegenerate Delaunay triangles with valid anchor ids", () => {
    const model = createTessellationModel(92, 1.5);
    const triangles = triangulateTessellation(model.anchors);
    const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));

    expect(triangles).toEqual(triangulateTessellation(createTessellationModel(92, 1.5).anchors));
    expect(triangles.length).toBeGreaterThan(model.anchors.length);
    for (const triangle of triangles) {
      expect(new Set(triangle).size).toBe(3);
      const [a, b, c] = triangle.map((id) => anchorsById.get(id)!);
      expect(a).toBeDefined();
      expect(b).toBeDefined();
      expect(c).toBeDefined();
      const doubledArea = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      expect(doubledArea).toBeGreaterThan(1e-8);
    }
  });

  test("motion is delta-time-aware and deterministic", () => {
    const first = createTessellationModel(413, 1.2);
    const second = createTessellationModel(413, 1.2);

    for (let index = 0; index < 120; index += 1) {
      advanceTessellationModel(first, 1 / 60, { x: 0.35, y: 0.62 }, 1);
    }
    for (let index = 0; index < 60; index += 1) {
      advanceTessellationModel(second, 1 / 30, { x: 0.35, y: 0.62 }, 1);
    }

    expect(snapshotModel(first)).toEqual(snapshotModel(second));
    expect(snapshotModel(first)).not.toEqual(snapshotModel(createTessellationModel(413, 1.2)));
  });

  test("keeps a bounded living population through births and retirements", () => {
    const model = createTessellationModel(77, 16 / 9);
    let sawBuddingAnchor = false;
    let sawRetiringAnchor = false;

    for (let index = 0; index < 3_600; index += 1) {
      advanceTessellationModel(model, 1 / 30, { x: 0.5, y: 0.5 }, 1);
      sawBuddingAnchor ||= model.anchors.some((anchor) => anchor.state === "budding");
      sawRetiringAnchor ||= model.anchors.some((anchor) => anchor.state === "retiring");
      const livingCount = model.anchors.filter((anchor) => !anchor.boundary && anchor.state !== "dead").length;
      expect(livingCount).toBeGreaterThanOrEqual(TESSELLATION_MIN_INTERIOR_ANCHORS);
      expect(livingCount).toBeLessThanOrEqual(TESSELLATION_MAX_INTERIOR_ANCHORS);
      expect(model.pulses.length).toBeLessThanOrEqual(TESSELLATION_MAX_LIFECYCLE_PULSES);
    }

    expect(sawBuddingAnchor).toBe(true);
    expect(sawRetiringAnchor).toBe(true);
  });

  test("fades lifecycle endpoints and topology transitions smoothly", () => {
    const model = createTessellationModel(8);
    const anchor = model.anchors.find((candidate) => !candidate.boundary)!;
    anchor.state = "budding";
    anchor.stateAge = 0;
    expect(getAnchorLife(anchor)).toBe(0);
    anchor.stateAge = 1.8;
    expect(getAnchorLife(anchor)).toBe(1);
    anchor.state = "retiring";
    anchor.stateAge = 2.4;
    expect(getAnchorLife(anchor)).toBe(0);

    expect(getTessellationTransitionWeights(0)).toEqual({ outgoing: 1, incoming: 0 });
    expect(getTessellationTransitionWeights(TESSELLATION_TRANSITION_SECONDS / 2)).toEqual({
      outgoing: 0.5,
      incoming: 0.5,
    });
    expect(getTessellationTransitionWeights(TESSELLATION_TRANSITION_SECONDS)).toEqual({
      outgoing: 0,
      incoming: 1,
    });
    expect(isTessellationTransitionComplete(TESSELLATION_TRANSITION_SECONDS - 0.001)).toBe(false);
    expect(isTessellationTransitionComplete(TESSELLATION_TRANSITION_SECONDS)).toBe(true);
    expect(canStartTessellationTransition(true)).toBe(false);
    expect(canStartTessellationTransition(false)).toBe(true);
  });

  test("deduplicates shared edges and keeps unchanged connections fully stable during transitions", () => {
    const previous = [
      [1, 2, 3],
      [2, 4, 3],
    ] as const;
    const current = [
      [1, 2, 4],
      [1, 4, 3],
    ] as const;
    const previousEdges = createTessellationEdges(previous);
    const transitionalEdges = createTessellationTransitionEdges(previous, current, {
      outgoing: 0.75,
      incoming: 0.25,
    });

    expect(previousEdges).toHaveLength(5);
    expect(new Set(previousEdges.map((edge) => edge.join(":"))).size).toBe(previousEdges.length);
    expect(transitionalEdges.find(({ edge }) => edge[0] === 1 && edge[1] === 2)?.opacity).toBe(1);
    expect(transitionalEdges.find(({ edge }) => edge[0] === 2 && edge[1] === 3)?.opacity).toBe(0.75);
    expect(transitionalEdges.find(({ edge }) => edge[0] === 1 && edge[1] === 4)?.opacity).toBe(0.25);
  });

  test("gives anchors slow individual glow cycles", () => {
    const model = createTessellationModel(610);
    const anchor = model.anchors.find((candidate) => !candidate.boundary)!;
    const samples: number[] = [];
    model.pulses = [];

    for (let time = 0; time <= 100; time += 2) {
      model.time = time;
      samples.push(getAnchorGlow(model, anchor));
    }

    expect(Math.max(...samples) - Math.min(...samples)).toBeGreaterThan(0.12);
    expect(Math.min(...samples)).toBeGreaterThanOrEqual(0.04);
    expect(Math.max(...samples)).toBeLessThanOrEqual(0.62);
  });

  test("keeps hue continuous across the shader palette wrap boundary", () => {
    const model = createTessellationModel(27);
    const anchor = model.anchors.find((candidate) => !candidate.boundary)!;
    anchor.hue = 0.99;
    anchor.hueRate = 0.01;
    model.time = 0.9;
    const beforeWrap = getAnchorHue(model, anchor);
    model.time = 1.1;
    const afterWrap = getAnchorHue(model, anchor);

    expect(beforeWrap).toBeCloseTo(0.999);
    expect(afterWrap).toBeCloseTo(1.001);
    expect(afterWrap - beforeWrap).toBeCloseTo(0.002);
  });

  test("emits bounded deterministic lifecycle pulses that ripple through nearby anchors", () => {
    const first = createTessellationModel(915);
    const second = createTessellationModel(915);

    while (first.pulses.length === 0) {
      advanceTessellationModel(first, 0.1, { x: 0.5, y: 0.5 }, 1);
      advanceTessellationModel(second, 0.1, { x: 0.5, y: 0.5 }, 1);
    }

    expect(first.pulses).toEqual(second.pulses);
    expect(first.pulses.length).toBeLessThanOrEqual(TESSELLATION_MAX_LIFECYCLE_PULSES);
    const pulse = first.pulses[0];
    const wavefrontX = pulse.x + (0.025 + (pulse.age / pulse.duration) * 0.72) / first.aspectRatio;
    const nearby = getLifecyclePulseInfluence(pulse, wavefrontX, pulse.y, first.aspectRatio);
    const distant = getLifecyclePulseInfluence(pulse, pulse.x + 1, pulse.y + 1, first.aspectRatio);
    expect(Math.abs(nearby.motion)).toBeGreaterThan(Math.abs(distant.motion));
    expect(nearby.glow).toBeGreaterThan(distant.glow);
  });

  test("only requests topology work at the deliberate four-hertz cadence", () => {
    let elapsed = 0;

    for (let index = 0; index < 14; index += 1) {
      const cadence = consumeTopologyTime(elapsed, 1 / 60);
      expect(cadence.shouldRebuild).toBe(false);
      elapsed = cadence.remainingSeconds;
    }

    const cadence = consumeTopologyTime(elapsed, 1 / 30);
    expect(cadence.shouldRebuild).toBe(true);
    expect(TESSELLATION_TOPOLOGY_INTERVAL_SECONDS).toBe(0.25);
  });

  test("always accepts the first measured viewport aspect before thresholding later resizes", () => {
    expect(shouldResetTessellationAspect(false, 1, 1.02)).toBe(true);
    expect(shouldResetTessellationAspect(true, 1, 1.02)).toBe(false);
    expect(shouldResetTessellationAspect(true, 1, 1.19)).toBe(true);
  });

  test("keeps user controls inside curated ranges", () => {
    expect(createTessellationValues({ kind: "tessellation", seed: 1, speed: -10, intensity: -10 })).toEqual({
      speed: 0.25,
      intensity: 0.5,
    });
    expect(createTessellationValues({ kind: "tessellation", seed: 1, speed: 10, intensity: 10 })).toEqual({
      speed: 1.75,
      intensity: 1.35,
    });
  });
});
