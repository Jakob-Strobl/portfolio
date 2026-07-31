import {
  advanceTessellationModel,
  consumeTopologyTime,
  createTessellationModel,
  createTessellationValues,
  getAnchorLife,
  getTessellationTransitionWeights,
  TESSELLATION_MAX_INTERIOR_ANCHORS,
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
