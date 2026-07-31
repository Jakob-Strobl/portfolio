import type { TessellationBackgroundConfig } from "./types";
import { normalizeSeed } from "./wave-model";

export const TESSELLATION_MIN_INTERIOR_ANCHORS = 32;
export const TESSELLATION_MAX_INTERIOR_ANCHORS = 48;
export const TESSELLATION_TOPOLOGY_INTERVAL_SECONDS = 0.25;
export const TESSELLATION_TRANSITION_SECONDS = 0.45;
export const TESSELLATION_MAX_LIFECYCLE_PULSES = 3;

const BIRTH_DURATION_SECONDS = 1.8;
const RETIRE_DURATION_SECONDS = 2.4;
const BOUNDARY_MARGIN = 0.09;
const TAU = Math.PI * 2;
const LIFECYCLE_PULSE_DURATION_SECONDS = 3.2;

export type TessellationAnchorState = "active" | "budding" | "retiring" | "dead";

export type TessellationAnchor = {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  velocityX: number;
  velocityY: number;
  phaseX: number;
  phaseY: number;
  frequency: number;
  hue: number;
  hueRate: number;
  brightness: number;
  glowPhase: number;
  glowFrequency: number;
  boundary: boolean;
  state: TessellationAnchorState;
  stateAge: number;
  originX: number;
  originY: number;
  retirementTargetId?: number;
};

export type TessellationTriangle = readonly [number, number, number];
export type TessellationEdge = readonly [number, number];

export type TessellationLifecyclePulse = {
  x: number;
  y: number;
  age: number;
  duration: number;
  strength: number;
  phase: number;
};

export type TessellationModel = {
  seed: number;
  time: number;
  rngState: number;
  nextAnchorId: number;
  eventElapsed: number;
  nextEventAt: number;
  aspectRatio: number;
  anchors: TessellationAnchor[];
  pulses: TessellationLifecyclePulse[];
};

export type TessellationValues = {
  speed: number;
  intensity: number;
};

type WorkingPoint = {
  id: number;
  x: number;
  y: number;
};

type WorkingTriangle = {
  a: number;
  b: number;
  c: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(value: number) {
  const progress = clamp(value, 0, 1);
  return progress * progress * (3 - 2 * progress);
}

function nextRandom(model: TessellationModel) {
  model.rngState = (model.rngState + 0x6d2b79f5) >>> 0;
  let value = model.rngState;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function randomRange(model: TessellationModel, minimum: number, maximum: number) {
  return minimum + nextRandom(model) * (maximum - minimum);
}

function createAnchor(model: TessellationModel, x: number, y: number, boundary = false): TessellationAnchor {
  return {
    id: model.nextAnchorId++,
    x,
    y,
    baseX: x,
    baseY: y,
    velocityX: 0,
    velocityY: 0,
    phaseX: nextRandom(model) * TAU,
    phaseY: nextRandom(model) * TAU,
    frequency: randomRange(model, 0.12, 0.24),
    hue: nextRandom(model),
    hueRate: randomRange(model, 0.0025, 0.008),
    brightness: randomRange(model, 0.72, 1),
    glowPhase: nextRandom(model) * TAU,
    glowFrequency: randomRange(model, 0.075, 0.16),
    boundary,
    state: "active",
    stateAge: 0,
    originX: x,
    originY: y,
  };
}

function addBoundaryAnchors(model: TessellationModel, interiorCount: number) {
  const horizontalSegments = Math.max(5, Math.round(Math.sqrt(interiorCount * model.aspectRatio)));
  const verticalSegments = Math.max(4, Math.round(Math.sqrt(interiorCount / model.aspectRatio)));

  for (let index = 0; index <= horizontalSegments; index += 1) {
    const x = -BOUNDARY_MARGIN + (index / horizontalSegments) * (1 + BOUNDARY_MARGIN * 2);
    model.anchors.push(createAnchor(model, x, -BOUNDARY_MARGIN, true));
    model.anchors.push(createAnchor(model, x, 1 + BOUNDARY_MARGIN, true));
  }

  for (let index = 1; index < verticalSegments; index += 1) {
    const y = -BOUNDARY_MARGIN + (index / verticalSegments) * (1 + BOUNDARY_MARGIN * 2);
    model.anchors.push(createAnchor(model, -BOUNDARY_MARGIN, y, true));
    model.anchors.push(createAnchor(model, 1 + BOUNDARY_MARGIN, y, true));
  }
}

function addInteriorAnchors(model: TessellationModel, count: number) {
  const minimumDistance = Math.sqrt(model.aspectRatio / count) * 0.49;
  const maximumAttempts = count * 80;
  let attempts = 0;

  while (model.anchors.length < count && attempts < maximumAttempts) {
    attempts += 1;
    const x = randomRange(model, 0.025, 0.975);
    const y = randomRange(model, 0.025, 0.975);
    const isSeparated = model.anchors.every((anchor) => {
      const dx = (anchor.x - x) * model.aspectRatio;
      const dy = anchor.y - y;
      return dx * dx + dy * dy >= minimumDistance * minimumDistance;
    });

    if (isSeparated) model.anchors.push(createAnchor(model, x, y));
  }

  // The rejection pass normally fills the population. This deterministic grid fallback
  // ensures unusual aspect ratios can never leave the model below its safe minimum.
  while (model.anchors.length < count) {
    const index = model.anchors.length;
    const columns = Math.ceil(Math.sqrt(count * model.aspectRatio));
    const rows = Math.ceil(count / columns);
    const column = index % columns;
    const row = Math.floor(index / columns);
    model.anchors.push(createAnchor(model, (column + 0.5) / columns, (row + 0.5) / rows));
  }
}

export function createTessellationValues(config: TessellationBackgroundConfig): TessellationValues {
  return {
    speed: clamp(config.speed, 0.25, 1.75),
    intensity: clamp(config.intensity, 0.5, 1.35),
  };
}

export function createTessellationModel(seed: number, aspectRatio = 16 / 9): TessellationModel {
  const normalizedSeed = normalizeSeed(seed);
  const model: TessellationModel = {
    seed: normalizedSeed,
    time: 0,
    rngState: normalizedSeed,
    nextAnchorId: 0,
    eventElapsed: 0,
    nextEventAt: 0,
    aspectRatio: clamp(aspectRatio, 0.5, 2.5),
    anchors: [],
    pulses: [],
  };
  const interiorCount = 36 + Math.floor(nextRandom(model) * 7);

  addInteriorAnchors(model, interiorCount);
  addBoundaryAnchors(model, interiorCount);
  model.nextEventAt = randomRange(model, 7, 12);
  return model;
}

function triangleArea(a: WorkingPoint, b: WorkingPoint, c: WorkingPoint) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function isInsideCircumcircle(point: WorkingPoint, triangle: WorkingTriangle, points: WorkingPoint[]) {
  const a = points[triangle.a];
  const b = points[triangle.b];
  const c = points[triangle.c];
  const ax = a.x - point.x;
  const ay = a.y - point.y;
  const bx = b.x - point.x;
  const by = b.y - point.y;
  const cx = c.x - point.x;
  const cy = c.y - point.y;
  const determinant =
    (ax * ax + ay * ay) * (bx * cy - cx * by) -
    (bx * bx + by * by) * (ax * cy - cx * ay) +
    (cx * cx + cy * cy) * (ax * by - bx * ay);
  const orientation = triangleArea(a, b, c);
  return orientation > 0 ? determinant > 1e-10 : determinant < -1e-10;
}

function addPolygonEdge(edges: Array<readonly [number, number]>, first: number, second: number) {
  const reverseIndex = edges.findIndex(([a, b]) => (a === second && b === first) || (a === first && b === second));

  if (reverseIndex >= 0) edges.splice(reverseIndex, 1);
  else edges.push([first, second]);
}

export function triangulateTessellation(anchors: readonly TessellationAnchor[]): TessellationTriangle[] {
  const liveAnchors = anchors
    .filter((anchor) => anchor.state !== "dead")
    .map((anchor) => ({ id: anchor.id, x: anchor.x, y: anchor.y }))
    .sort((a, b) => a.x - b.x || a.y - b.y || a.id - b.id);

  if (liveAnchors.length < 3) return [];
  const points: WorkingPoint[] = [
    ...liveAnchors,
    { id: -1, x: -8, y: -5 },
    { id: -2, x: 9, y: -5 },
    { id: -3, x: 0.5, y: 10 },
  ];
  const superStart = liveAnchors.length;
  let triangles: WorkingTriangle[] = [{ a: superStart, b: superStart + 1, c: superStart + 2 }];

  for (let pointIndex = 0; pointIndex < liveAnchors.length; pointIndex += 1) {
    const badTriangles = triangles.filter((triangle) => isInsideCircumcircle(points[pointIndex], triangle, points));
    const polygon: Array<readonly [number, number]> = [];

    for (const triangle of badTriangles) {
      addPolygonEdge(polygon, triangle.a, triangle.b);
      addPolygonEdge(polygon, triangle.b, triangle.c);
      addPolygonEdge(polygon, triangle.c, triangle.a);
    }

    const badSet = new Set(badTriangles);
    triangles = triangles.filter((triangle) => !badSet.has(triangle));
    for (const [a, b] of polygon) {
      const triangle = { a, b, c: pointIndex };
      if (triangleArea(points[a], points[b], points[pointIndex]) < 0) {
        triangle.a = b;
        triangle.b = a;
      }
      triangles.push(triangle);
    }
  }

  return triangles
    .filter((triangle) => triangle.a < superStart && triangle.b < superStart && triangle.c < superStart)
    .filter((triangle) => Math.abs(triangleArea(points[triangle.a], points[triangle.b], points[triangle.c])) > 1e-8)
    .map((triangle) => {
      const a = points[triangle.a];
      const b = points[triangle.b];
      const c = points[triangle.c];
      return triangleArea(a, b, c) > 0 ? ([a.id, b.id, c.id] as const) : ([a.id, c.id, b.id] as const);
    })
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}

export function getAnchorLife(anchor: TessellationAnchor) {
  if (anchor.boundary) return 1;
  if (anchor.state === "budding") return smoothstep(anchor.stateAge / BIRTH_DURATION_SECONDS);
  if (anchor.state === "retiring") return 1 - smoothstep(anchor.stateAge / RETIRE_DURATION_SECONDS);
  if (anchor.state === "dead") return 0;
  return 1;
}

export function getTessellationTransitionWeights(elapsedSeconds: number) {
  const incoming = smoothstep(elapsedSeconds / TESSELLATION_TRANSITION_SECONDS);
  return { outgoing: 1 - incoming, incoming };
}

export function isTessellationTransitionComplete(elapsedSeconds: number) {
  return elapsedSeconds >= TESSELLATION_TRANSITION_SECONDS;
}

export function canStartTessellationTransition(hasActiveTransition: boolean) {
  return !hasActiveTransition;
}

function edgeKey(first: number, second: number) {
  return first < second ? `${first}:${second}` : `${second}:${first}`;
}

export function createTessellationEdges(triangles: readonly TessellationTriangle[]): TessellationEdge[] {
  const edges = new Map<string, TessellationEdge>();

  for (const [a, b, c] of triangles) {
    for (const [first, second] of [
      [a, b],
      [b, c],
      [c, a],
    ] as const) {
      const edge: TessellationEdge = first < second ? [first, second] : [second, first];
      edges.set(edgeKey(first, second), edge);
    }
  }

  return [...edges.values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

export function createTessellationTransitionEdges(
  previous: readonly TessellationTriangle[] | undefined,
  current: readonly TessellationTriangle[],
  weights: Readonly<{ outgoing: number; incoming: number }>,
) {
  const currentEdges = createTessellationEdges(current);
  if (previous == null) return currentEdges.map((edge) => ({ edge, opacity: 1 }));
  const previousEdges = createTessellationEdges(previous);
  const previousKeys = new Set(previousEdges.map(([a, b]) => edgeKey(a, b)));
  const currentKeys = new Set(currentEdges.map(([a, b]) => edgeKey(a, b)));

  return [
    ...previousEdges
      .filter(([a, b]) => !currentKeys.has(edgeKey(a, b)))
      .map((edge) => ({ edge, opacity: weights.outgoing })),
    ...currentEdges.map((edge) => ({
      edge,
      opacity: previousKeys.has(edgeKey(edge[0], edge[1])) ? 1 : weights.incoming,
    })),
  ];
}

export function getLifecyclePulseInfluence(
  pulse: TessellationLifecyclePulse,
  x: number,
  y: number,
  aspectRatio: number,
) {
  const dx = (x - pulse.x) * aspectRatio;
  const dy = y - pulse.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const progress = clamp(pulse.age / pulse.duration, 0, 1);
  const wavefront = 0.025 + progress * 0.72;
  const envelope = Math.exp(-(((distance - wavefront) / 0.13) ** 2)) * (1 - smoothstep(progress));
  const oscillation = Math.sin((distance - wavefront) * 34 + pulse.phase);

  return {
    dx,
    dy,
    distance,
    motion: envelope * oscillation * pulse.strength,
    glow: envelope * (0.55 + oscillation * 0.25) * pulse.strength,
  };
}

export function getAnchorGlow(model: TessellationModel, anchor: TessellationAnchor) {
  const ambientWave = 0.5 + 0.5 * Math.sin(model.time * anchor.glowFrequency + anchor.glowPhase);
  const ambient = 0.06 + ambientWave * (anchor.boundary ? 0.1 : 0.18);
  const pulseGlow = model.pulses.reduce(
    (strongest, pulse) =>
      Math.max(strongest, getLifecyclePulseInfluence(pulse, anchor.x, anchor.y, model.aspectRatio).glow),
    0,
  );
  return clamp(ambient + pulseGlow * 0.38, 0.04, 0.62);
}

export function getAnchorHue(model: TessellationModel, anchor: TessellationAnchor) {
  return anchor.hue + model.time * anchor.hueRate;
}

export function consumeTopologyTime(accumulatedSeconds: number, deltaSeconds: number) {
  const total = Math.max(0, accumulatedSeconds) + Math.max(0, deltaSeconds);
  return {
    shouldRebuild: total >= TESSELLATION_TOPOLOGY_INTERVAL_SECONDS,
    remainingSeconds: total % TESSELLATION_TOPOLOGY_INTERVAL_SECONDS,
  };
}

export function shouldResetTessellationAspect(
  hasMeasuredViewport: boolean,
  previousAspectRatio: number,
  nextAspectRatio: number,
) {
  if (!hasMeasuredViewport) return true;
  return Math.abs(nextAspectRatio - previousAspectRatio) / Math.max(0.5, previousAspectRatio) > 0.18;
}

export function tessellationTopologySignature(triangles: readonly TessellationTriangle[]) {
  return triangles.map((triangle) => triangle.join(",")).join(";");
}

function countInteriorAnchors(model: TessellationModel) {
  return model.anchors.filter((anchor) => !anchor.boundary && anchor.state !== "dead").length;
}

function emitLifecyclePulse(model: TessellationModel, x: number, y: number, strength: number) {
  model.pulses.push({
    x,
    y,
    age: 0,
    duration: LIFECYCLE_PULSE_DURATION_SECONDS,
    strength,
    phase: nextRandom(model) * TAU,
  });
  if (model.pulses.length > TESSELLATION_MAX_LIFECYCLE_PULSES) {
    model.pulses.splice(0, model.pulses.length - TESSELLATION_MAX_LIFECYCLE_PULSES);
  }
}

function birthAnchor(model: TessellationModel) {
  const triangles = triangulateTessellation(model.anchors);
  const anchorsById = new Map(model.anchors.map((anchor) => [anchor.id, anchor]));
  const candidates = triangles.filter((triangle) => {
    const points = triangle.map((id) => anchorsById.get(id));
    if (points.some((point) => point == null || point.boundary)) return false;
    const centroidX = points.reduce((sum, point) => sum + (point?.x ?? 0), 0) / 3;
    const centroidY = points.reduce((sum, point) => sum + (point?.y ?? 0), 0) / 3;
    return centroidX > 0.08 && centroidX < 0.92 && centroidY > 0.08 && centroidY < 0.92;
  });

  if (candidates.length === 0) return;
  const triangle = candidates[Math.floor(nextRandom(model) * candidates.length)];
  const points = triangle.map((id) => anchorsById.get(id)!);
  const originX = points.reduce((sum, point) => sum + point.x, 0) / 3;
  const originY = points.reduce((sum, point) => sum + point.y, 0) / 3;
  const angle = nextRandom(model) * TAU;
  const anchor = createAnchor(model, originX + Math.cos(angle) * 0.002, originY + Math.sin(angle) * 0.002);
  anchor.baseX = clamp(originX + Math.cos(angle) * 0.055, 0.04, 0.96);
  anchor.baseY = clamp(originY + Math.sin(angle) * 0.055, 0.04, 0.96);
  anchor.originX = originX;
  anchor.originY = originY;
  anchor.state = "budding";
  model.anchors.push(anchor);
  emitLifecyclePulse(model, originX, originY, 0.9);
}

function retireAnchor(model: TessellationModel) {
  const candidates = model.anchors.filter((anchor) => !anchor.boundary && anchor.state === "active");
  if (candidates.length === 0) return;
  const anchor = candidates[Math.floor(nextRandom(model) * candidates.length)];
  const neighbors = model.anchors.filter(
    (candidate) => !candidate.boundary && candidate.id !== anchor.id && candidate.state !== "dead",
  );
  const target = neighbors.reduce<TessellationAnchor | undefined>((closest, candidate) => {
    if (closest == null) return candidate;
    const candidateDistance = (candidate.x - anchor.x) ** 2 + (candidate.y - anchor.y) ** 2;
    const closestDistance = (closest.x - anchor.x) ** 2 + (closest.y - anchor.y) ** 2;
    return candidateDistance < closestDistance ? candidate : closest;
  }, undefined);

  if (target == null) return;
  anchor.state = "retiring";
  anchor.stateAge = 0;
  anchor.retirementTargetId = target.id;
  emitLifecyclePulse(model, anchor.x, anchor.y, 0.72);
}

function updateLifecycle(model: TessellationModel, deltaSeconds: number) {
  for (const pulse of model.pulses) pulse.age += deltaSeconds;
  model.pulses = model.pulses.filter((pulse) => pulse.age < pulse.duration);

  for (const anchor of model.anchors) {
    if (anchor.state !== "budding" && anchor.state !== "retiring") continue;
    anchor.stateAge += deltaSeconds;

    if (anchor.state === "budding" && anchor.stateAge >= BIRTH_DURATION_SECONDS) {
      anchor.state = "active";
      anchor.stateAge = 0;
    } else if (anchor.state === "retiring" && anchor.stateAge >= RETIRE_DURATION_SECONDS) {
      anchor.state = "dead";
      anchor.stateAge = 0;
    }
  }

  model.eventElapsed += deltaSeconds;
  if (model.eventElapsed < model.nextEventAt) return;
  model.eventElapsed %= model.nextEventAt;
  const count = countInteriorAnchors(model);
  const shouldBirth =
    count <= TESSELLATION_MIN_INTERIOR_ANCHORS ||
    (count < TESSELLATION_MAX_INTERIOR_ANCHORS && nextRandom(model) < 0.52);

  if (shouldBirth) birthAnchor(model);
  else if (count > TESSELLATION_MIN_INTERIOR_ANCHORS) retireAnchor(model);
  model.nextEventAt = randomRange(model, 7, 12);
}

function advanceMotionStep(
  model: TessellationModel,
  deltaSeconds: number,
  pointer: Readonly<{ x: number; y: number }>,
  intensity: number,
) {
  model.time += deltaSeconds;
  const movable = model.anchors.filter((anchor) => !anchor.boundary && anchor.state !== "dead");
  const acceleration = new Map<number, { x: number; y: number }>();

  for (const anchor of movable) {
    const dx = (anchor.x - pointer.x) * model.aspectRatio;
    const dy = anchor.y - pointer.y;
    const distance = Math.sqrt(dx * dx + dy * dy) + 1e-5;
    const pointerInfluence = Math.exp(-(distance * distance) / 0.055) * intensity;
    const ripple = Math.sin(distance * 25 - model.time * 1.7 + anchor.phaseX) * pointerInfluence;
    let lifecycleRippleX = 0;
    let lifecycleRippleY = 0;

    for (const pulse of model.pulses) {
      const influence = getLifecyclePulseInfluence(pulse, anchor.x, anchor.y, model.aspectRatio);
      if (influence.distance < 1e-5) continue;
      lifecycleRippleX += (influence.dx / influence.distance / model.aspectRatio) * influence.motion * 0.018;
      lifecycleRippleY += (influence.dy / influence.distance) * influence.motion * 0.018;
    }
    acceleration.set(anchor.id, {
      x:
        Math.sin(model.time * anchor.frequency + anchor.phaseX) * 0.006 +
        (anchor.baseX - anchor.x) * 0.12 +
        (dx / distance / model.aspectRatio) * ripple * 0.008 +
        lifecycleRippleX,
      y:
        Math.cos(model.time * anchor.frequency * 0.83 + anchor.phaseY) * 0.006 +
        (anchor.baseY - anchor.y) * 0.12 +
        (dy / distance) * ripple * 0.008 +
        lifecycleRippleY,
    });
  }

  const separationDistance = 0.105;
  for (let firstIndex = 0; firstIndex < movable.length; firstIndex += 1) {
    const first = movable[firstIndex];
    for (let secondIndex = firstIndex + 1; secondIndex < movable.length; secondIndex += 1) {
      const second = movable[secondIndex];
      const dx = (second.x - first.x) * model.aspectRatio;
      const dy = second.y - first.y;
      const distance = Math.sqrt(dx * dx + dy * dy) + 1e-5;
      if (distance >= separationDistance) continue;
      const force = ((separationDistance - distance) / separationDistance) * 0.025;
      const forceX = (dx / distance / model.aspectRatio) * force;
      const forceY = (dy / distance) * force;
      const firstAcceleration = acceleration.get(first.id)!;
      const secondAcceleration = acceleration.get(second.id)!;
      firstAcceleration.x -= forceX;
      firstAcceleration.y -= forceY;
      secondAcceleration.x += forceX;
      secondAcceleration.y += forceY;
    }
  }

  for (const anchor of movable) {
    const force = acceleration.get(anchor.id)!;

    if (anchor.state === "retiring") {
      const target = model.anchors.find((candidate) => candidate.id === anchor.retirementTargetId);
      if (target != null) {
        force.x += (target.x - anchor.x) * 0.34;
        force.y += (target.y - anchor.y) * 0.34;
      }
    } else if (anchor.state === "budding") {
      force.x += (anchor.baseX - anchor.originX) * 0.12;
      force.y += (anchor.baseY - anchor.originY) * 0.12;
    }

    const damping = Math.exp(-2.15 * deltaSeconds);
    anchor.velocityX = (anchor.velocityX + force.x * deltaSeconds) * damping;
    anchor.velocityY = (anchor.velocityY + force.y * deltaSeconds) * damping;
    const speed = Math.sqrt(anchor.velocityX ** 2 + anchor.velocityY ** 2);
    if (speed > 0.035) {
      anchor.velocityX *= 0.035 / speed;
      anchor.velocityY *= 0.035 / speed;
    }
    anchor.x = clamp(anchor.x + anchor.velocityX * deltaSeconds, 0.018, 0.982);
    anchor.y = clamp(anchor.y + anchor.velocityY * deltaSeconds, 0.018, 0.982);
  }

  updateLifecycle(model, deltaSeconds);
}

export function advanceTessellationModel(
  model: TessellationModel,
  deltaSeconds: number,
  pointer: Readonly<{ x: number; y: number }>,
  intensity: number,
) {
  let remaining = clamp(deltaSeconds, 0, 0.1);

  while (remaining > 0) {
    const step = Math.min(remaining, 1 / 60);
    advanceMotionStep(model, step, pointer, clamp(intensity, 0.5, 1.35));
    remaining -= step;
  }
}

export function pruneDeadTessellationAnchors(model: TessellationModel, retainedIds: ReadonlySet<number>) {
  model.anchors = model.anchors.filter((anchor) => anchor.state !== "dead" || retainedIds.has(anchor.id));
}
