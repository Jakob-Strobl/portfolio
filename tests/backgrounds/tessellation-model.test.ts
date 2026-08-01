import {
  advanceTessellationModel,
  canAdoptTessellationTopology,
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
  getTessellationFillTransitionOpacities,
  getTessellationFacetLight,
  getTessellationInteriorAnchorRange,
  getTessellationMirageStyle,
  getTessellationSpatialStyle,
  getTessellationTransitionWeights,
  isTessellationMobileViewport,
  isTessellationTransitionComplete,
  TESSELLATION_MAX_INTERIOR_ANCHORS,
  TESSELLATION_MAX_LIFECYCLE_PULSES,
  TESSELLATION_MOBILE_MAX_INTERIOR_ANCHORS,
  TESSELLATION_MOBILE_MIN_INTERIOR_ANCHORS,
  TESSELLATION_MIN_INTERIOR_ANCHORS,
  TESSELLATION_MIN_TOPOLOGY_DWELL_SECONDS,
  TESSELLATION_TOPOLOGY_INTERVAL_SECONDS,
  TESSELLATION_TRANSITION_SECONDS,
  shouldResetTessellationAspect,
  triangulateTessellation,
} from "../../src/backgrounds/tessellation-model";

function snapshotModel(model: ReturnType<typeof createTessellationModel>) {
  return model.anchors.map(({ id, x, y, hue, brightness, mass, luminosity, relief, boundary, state }) => ({
    id,
    x,
    y,
    hue,
    brightness,
    mass,
    luminosity,
    relief,
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
    expect(interior.every((anchor) => anchor.mass >= 0.72 && anchor.mass <= 1.42)).toBe(true);
    expect(new Set(interior.map((anchor) => anchor.mass)).size).toBeGreaterThan(1);
    expect(interior.every((anchor) => anchor.relief >= -1 && anchor.relief <= 1)).toBe(true);
    expect(new Set(interior.map((anchor) => anchor.relief)).size).toBeGreaterThan(1);
    expect(first.anchors.some((anchor) => anchor.boundary && anchor.x < 0)).toBe(true);
    expect(first.anchors.some((anchor) => anchor.boundary && anchor.x > 1)).toBe(true);
    expect(first.nextEventAt).toBeGreaterThanOrEqual(5.5);
    expect(first.nextEventAt).toBeLessThanOrEqual(9);
  });

  test("uses a smaller anchor population for mobile-sized viewports", () => {
    const desktopRange = getTessellationInteriorAnchorRange(16 / 9, 1440);
    const mobileRange = getTessellationInteriorAnchorRange(390 / 844, 390);
    const desktop = createTessellationModel(123, 16 / 9, 1440);
    const mobile = createTessellationModel(123, 390 / 844, 390);
    const desktopInterior = desktop.anchors.filter((anchor) => !anchor.boundary);
    const mobileInterior = mobile.anchors.filter((anchor) => !anchor.boundary);

    expect(isTessellationMobileViewport(390 / 844, 390)).toBe(true);
    expect(desktopRange).toEqual({
      minimum: TESSELLATION_MIN_INTERIOR_ANCHORS,
      maximum: TESSELLATION_MAX_INTERIOR_ANCHORS,
    });
    expect(mobileRange).toEqual({
      minimum: TESSELLATION_MOBILE_MIN_INTERIOR_ANCHORS,
      maximum: TESSELLATION_MOBILE_MAX_INTERIOR_ANCHORS,
    });
    expect(mobileRange.maximum).toBeLessThan(desktopRange.minimum);
    expect(mobileInterior.length).toBeLessThan(desktopInterior.length);
    expect(mobileInterior.length).toBeLessThanOrEqual(mobileRange.maximum);
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
      advanceTessellationModel(first, 1 / 60);
    }
    for (let index = 0; index < 60; index += 1) {
      advanceTessellationModel(second, 1 / 30);
    }

    expect(snapshotModel(first)).toEqual(snapshotModel(second));
    expect(snapshotModel(first)).not.toEqual(snapshotModel(createTessellationModel(413, 1.2)));
    expect(advanceTessellationModel).toHaveLength(2);
  });

  test("assigns sparse deterministic luminosity with only mild positive mass correlation", () => {
    const models = Array.from({ length: 20 }, (_, index) => createTessellationModel(100 + index));
    const duplicate = createTessellationModel(100);
    const anchors = models.flatMap((model) => model.anchors.filter((anchor) => !anchor.boundary));
    const luminous = anchors.filter((anchor) => anchor.luminosity > 0.05);
    const meanMass = anchors.reduce((sum, anchor) => sum + anchor.mass, 0) / anchors.length;
    const meanLuminosity = anchors.reduce((sum, anchor) => sum + anchor.luminosity, 0) / anchors.length;
    const covariance =
      anchors.reduce((sum, anchor) => sum + (anchor.mass - meanMass) * (anchor.luminosity - meanLuminosity), 0) /
      anchors.length;
    const massDeviation = Math.sqrt(
      anchors.reduce((sum, anchor) => sum + (anchor.mass - meanMass) ** 2, 0) / anchors.length,
    );
    const luminosityDeviation = Math.sqrt(
      anchors.reduce((sum, anchor) => sum + (anchor.luminosity - meanLuminosity) ** 2, 0) / anchors.length,
    );
    const correlation = covariance / (massDeviation * luminosityDeviation);

    expect(models[0].anchors.map(({ id, luminosity }) => ({ id, luminosity }))).toEqual(
      duplicate.anchors.map(({ id, luminosity }) => ({ id, luminosity })),
    );
    expect(anchors.every((anchor) => anchor.luminosity >= 0 && anchor.luminosity <= 1)).toBe(true);
    expect(luminous.length / anchors.length).toBeGreaterThanOrEqual(0.1);
    expect(luminous.length / anchors.length).toBeLessThanOrEqual(0.18);
    expect(correlation).toBeGreaterThan(0.05);
    expect(correlation).toBeLessThan(0.5);
  });

  test("keeps a bounded living population through births and retirements", () => {
    const model = createTessellationModel(77, 16 / 9);
    let sawBuddingAnchor = false;
    let sawRetiringAnchor = false;
    let sawBirthPulseAtTrigger = false;
    let sawRetirementPulseAtTrigger = false;

    for (let index = 0; index < 3_600; index += 1) {
      advanceTessellationModel(model, 1 / 30);
      sawBuddingAnchor ||= model.anchors.some((anchor) => anchor.state === "budding");
      sawRetiringAnchor ||= model.anchors.some((anchor) => anchor.state === "retiring");
      sawBirthPulseAtTrigger ||=
        model.anchors.some((anchor) => anchor.state === "budding") &&
        model.pulses.some((pulse) => pulse.direction === 1);
      sawRetirementPulseAtTrigger ||=
        model.anchors.some((anchor) => anchor.state === "retiring") &&
        model.pulses.some((pulse) => pulse.direction === -1);
      const livingCount = model.anchors.filter((anchor) => !anchor.boundary && anchor.state !== "dead").length;
      expect(livingCount).toBeGreaterThanOrEqual(TESSELLATION_MIN_INTERIOR_ANCHORS);
      expect(livingCount).toBeLessThanOrEqual(TESSELLATION_MAX_INTERIOR_ANCHORS);
      expect(model.pulses.length).toBeLessThanOrEqual(TESSELLATION_MAX_LIFECYCLE_PULSES);
    }

    expect(sawBuddingAnchor).toBe(true);
    expect(sawRetiringAnchor).toBe(true);
    expect(sawBirthPulseAtTrigger).toBe(true);
    expect(sawRetirementPulseAtTrigger).toBe(true);
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
    expect(canAdoptTessellationTopology(false, TESSELLATION_MIN_TOPOLOGY_DWELL_SECONDS - 0.01)).toBe(false);
    expect(canAdoptTessellationTopology(true, TESSELLATION_MIN_TOPOLOGY_DWELL_SECONDS)).toBe(false);
    expect(canAdoptTessellationTopology(false, TESSELLATION_MIN_TOPOLOGY_DWELL_SECONDS)).toBe(true);

    for (const elapsed of [0, TESSELLATION_TRANSITION_SECONDS * 0.25, TESSELLATION_TRANSITION_SECONDS * 0.5, 1]) {
      const fill = getTessellationFillTransitionOpacities(true, getTessellationTransitionWeights(elapsed));
      const sourceOverCoverage = fill.current + fill.previous * (1 - fill.current);
      expect(fill.previous).toBe(1);
      expect(sourceOverCoverage).toBe(1);
    }
    expect(getTessellationFillTransitionOpacities(false, { outgoing: 1, incoming: 0 })).toEqual({
      previous: 0,
      current: 1,
    });
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

    expect(Math.max(...samples) - Math.min(...samples)).toBeGreaterThan(0.65);
    expect(Math.min(...samples)).toBeLessThan(0.04);
    expect(Math.max(...samples)).toBeGreaterThan(0.7);
    expect(Math.max(...samples)).toBeLessThanOrEqual(1);
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

  test("selects stained-glass facets from a sparse continuous seeded spatial field", () => {
    const model = createTessellationModel(704);
    const triangles = triangulateTessellation(model.anchors);
    const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
    const centroids = triangles.map((triangle) => {
      const anchors = triangle.map((id) => anchorsById.get(id)!);
      return {
        x: (anchors[0].x + anchors[1].x + anchors[2].x) / 3,
        y: (anchors[0].y + anchors[1].y + anchors[2].y) / 3,
      };
    });
    const styles = centroids.map(({ x, y }) => getTessellationSpatialStyle(model.seed, x * model.aspectRatio, y));
    const selected = styles.filter((style) => style.selected);
    const sample = centroids[0];
    const nearby = { x: sample.x + 0.002, y: sample.y + 0.002 };
    const sampleStyle = getTessellationSpatialStyle(model.seed, sample.x * model.aspectRatio, sample.y);
    const nearbyStyle = getTessellationSpatialStyle(model.seed, nearby.x * model.aspectRatio, nearby.y);

    expect(sampleStyle).toEqual(getTessellationSpatialStyle(model.seed, sample.x * model.aspectRatio, sample.y));
    expect(sampleStyle).not.toEqual(
      getTessellationSpatialStyle(model.seed + 1, sample.x * model.aspectRatio, sample.y),
    );
    expect(Math.abs(sampleStyle.strength - nearbyStyle.strength)).toBeLessThan(0.015);
    expect(Math.abs(sampleStyle.hue - nearbyStyle.hue)).toBeLessThan(0.015);
    expect(selected.length / styles.length).toBeGreaterThan(0.07);
    expect(selected.length / styles.length).toBeLessThan(0.4);
    expect(selected.every((style) => style.strength > 0.01 && style.strength <= 0.21)).toBe(true);
  });

  test("derives deterministic bounded directional light from persistent anchor relief", () => {
    const model = createTessellationModel(704, 16 / 9);
    const duplicate = createTessellationModel(704, 16 / 9);
    const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
    const duplicateById = new Map(duplicate.anchors.map((anchor) => [anchor.id, anchor]));
    const triangles = triangulateTessellation(model.anchors);
    const lights = triangles.map((triangle) =>
      getTessellationFacetLight(
        triangle.map((id) => anchorsById.get(id)!) as [
          (typeof model.anchors)[number],
          (typeof model.anchors)[number],
          (typeof model.anchors)[number],
        ],
        model.aspectRatio,
      ),
    );
    const duplicateLights = triangles.map((triangle) =>
      getTessellationFacetLight(
        triangle.map((id) => duplicateById.get(id)!) as [
          (typeof duplicate.anchors)[number],
          (typeof duplicate.anchors)[number],
          (typeof duplicate.anchors)[number],
        ],
        duplicate.aspectRatio,
      ),
    );

    expect(lights).toEqual(duplicateLights);
    expect(lights.every((light) => light >= -1 && light <= 1)).toBe(true);
    expect(Math.max(...lights) - Math.min(...lights)).toBeGreaterThan(0.5);
  });

  test("selects dispersed mirage panes from a sparse continuous seeded field", () => {
    const model = createTessellationModel(704);
    const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
    const centroids = triangulateTessellation(model.anchors)
      .map((triangle) => {
        const anchors = triangle.map((id) => anchorsById.get(id)!);
        return {
          x: ((anchors[0].x + anchors[1].x + anchors[2].x) / 3) * model.aspectRatio,
          y: (anchors[0].y + anchors[1].y + anchors[2].y) / 3,
        };
      })
      .filter(({ x, y }) => x >= 0 && x <= model.aspectRatio && y >= 0 && y <= 1);
    const styles = centroids.map(({ x, y }) => getTessellationMirageStyle(model.seed, x, y));
    const differentSeedStyles = centroids.map(({ x, y }) => getTessellationMirageStyle(model.seed + 1, x, y));
    const selectedCentroids = centroids.filter((_, index) => styles[index].selected);
    const sample = centroids[0];
    const sampleStyle = getTessellationMirageStyle(model.seed, sample.x, sample.y);
    const nearbyStyle = getTessellationMirageStyle(model.seed, sample.x + 0.001, sample.y + 0.001);
    const occupiedColumns = new Set(
      selectedCentroids.map(({ x }) => Math.min(3, Math.floor((x / model.aspectRatio) * 4))),
    );
    const occupiedRows = new Set(selectedCentroids.map(({ y }) => Math.min(3, Math.floor(y * 4))));

    expect(sampleStyle).toEqual(getTessellationMirageStyle(model.seed, sample.x, sample.y));
    expect(styles).not.toEqual(differentSeedStyles);
    expect(Math.abs(sampleStyle.strength - nearbyStyle.strength)).toBeLessThan(0.01);
    expect(selectedCentroids.length / styles.length).toBeGreaterThan(0.05);
    expect(selectedCentroids.length / styles.length).toBeLessThan(0.35);
    expect(occupiedColumns.size).toBeGreaterThanOrEqual(3);
    expect(occupiedRows.size).toBeGreaterThanOrEqual(3);
    expect(styles.every((style) => style.strength >= 0 && style.strength <= 0.11)).toBe(true);
  });

  test("emits bounded deterministic lifecycle pulses that ripple through nearby anchors", () => {
    const first = createTessellationModel(915);
    const second = createTessellationModel(915);

    while (first.pulses.length === 0) {
      advanceTessellationModel(first, 0.1);
      advanceTessellationModel(second, 0.1);
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

  test("smoothly accumulates a softer permanent home shift as the lifecycle wave passes", () => {
    const pulsing = createTessellationModel(490, 16 / 9);
    const anchor = pulsing.anchors.find((candidate) => !candidate.boundary)!;
    const initialBase = { x: anchor.baseX, y: anchor.baseY };
    pulsing.pulses = [
      {
        x: anchor.x - 0.25 / pulsing.aspectRatio,
        y: anchor.y,
        age: 1,
        duration: 3.2,
        strength: 0.9,
        direction: 1,
      },
    ];
    const calm = structuredClone(pulsing);
    calm.pulses = [];
    const calmAnchor = calm.anchors.find((candidate) => candidate.id === anchor.id)!;
    const initialGlowBoost = getAnchorGlow(pulsing, anchor) - getAnchorGlow(calm, calmAnchor);
    expect(initialGlowBoost).toBeGreaterThan(0.25);

    const perFrameHomeShift: number[] = [];
    for (let index = 0; index < 12; index += 1) {
      const previousBaseX = anchor.baseX;
      advanceTessellationModel(pulsing, 1 / 60);
      advanceTessellationModel(calm, 1 / 60);
      perFrameHomeShift.push((anchor.baseX - previousBaseX) * pulsing.aspectRatio * 800);
    }
    expect(perFrameHomeShift.every((shift) => shift > 0)).toBe(true);
    expect(Math.max(...perFrameHomeShift)).toBeLessThan(0.08);

    for (let index = 0; index < 150; index += 1) {
      advanceTessellationModel(pulsing, 1 / 60);
      advanceTessellationModel(calm, 1 / 60);
    }

    const baseAfterPulse = { x: anchor.baseX, y: anchor.baseY };
    const permanentShiftPixels =
      Math.hypot((baseAfterPulse.x - initialBase.x) * pulsing.aspectRatio, baseAfterPulse.y - initialBase.y) * 800;
    expect(pulsing.pulses).toHaveLength(0);
    advanceTessellationModel(pulsing, 1 / 60);
    expect({ x: anchor.baseX, y: anchor.baseY }).toEqual(baseAfterPulse);
    expect(permanentShiftPixels).toBeGreaterThan(0.5);
    expect(permanentShiftPixels).toBeLessThan(4);
    expect(Math.hypot((anchor.x - calmAnchor.x) * pulsing.aspectRatio, anchor.y - calmAnchor.y) * 800).toBeLessThan(5);
  });

  test("uses a low-frequency lifecycle wave with few directional reversals", () => {
    const model = createTessellationModel(61, 1);
    const pulse = {
      x: 0.5,
      y: 0.5,
      age: 1,
      duration: 3.2,
      strength: 0.9,
      direction: 1 as const,
    };
    const motions: number[] = [];

    for (let offset = -0.3; offset <= 0.3; offset += 0.01) {
      motions.push(getLifecyclePulseInfluence(pulse, pulse.x + 0.25 + offset, pulse.y, model.aspectRatio).motion);
    }
    const meaningfulSigns = motions.filter((motion) => Math.abs(motion) > 0.01).map((motion) => Math.sign(motion));
    const reversals = meaningfulSigns.slice(1).filter((sign, index) => sign !== meaningfulSigns[index]).length;
    expect(reversals).toBeLessThanOrEqual(2);
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
